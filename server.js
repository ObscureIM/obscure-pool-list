var express = require("express");
var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain)

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  })
//mongoose
var mongoose = require("mongoose")
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var schema = new mongoose.Schema({
    name: String,
    height: Number,
    hashrate: Number,
    miners:Number,
    fee: String,
    minPayment: String,
    lastblock: Number,
    totalBlocks:Number
})
//run this to reset pool
var PoolModel = mongoose.model('poolModel',schema)
app.get('/',function(req,res) {
  updateDatabase()
  PoolModel.find({},[],function(err,post) {
    res.send(post)
  });
})
async function updateDatabase() {
  theUrl = "https://raw.githubusercontent.com/ObscureIM/obscure-pool-list/master/list.json#"
  httpGetAsync(theUrl).then(function(fufilled) {
    //fufilled is the list of all pool nodes
    for(var i=0;i<fufilled.length;i++) {
      //fufilled.length.api is the current api link in the loop
      var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      var xmlHttp = new XMLHttpRequest();
      var count = 0
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            if(xmlHttp.responseText != undefined) {
              json = JSON.parse(xmlHttp.responseText)
              console.log(i)
              var poolInfo = {
                name:fufilled[i].name,
                height:json.network.height,
                hashrate:json.pool.hashrate,
                miners:json.pool.miners,
                fee:json.config.fee + ' XSC',
                minPayment:(json.config.minPaymentThreshold / json.config.denominationUnit) + ' XSC',
                lastblock:json.pool.stats.lastBlockFound,
                totalblocks: json.pool.totalBlocks
              }
              var poolModel = new PoolModel(poolInfo)
              poolModel.save(function(err) {
                if (err) return handleError(err);
                console.log("saved")
              })
            }else if(count == 10) {
              console.log({
                status: this.status,
                statusText: "too many retries"
              })
            }
          }
      }
      xmlHttp.open("GET", fufilled[i].api, false); // true for asynchronous
      xmlHttp.send(null);
    }
    //delete the database
    PoolModel.remove({}, function(err) {
       console.log('collection removed')
    });
  }).catch((error) => {
    console.log(error)
  })
}

function httpGetAsync(theUrl) {
  return new Promise(function(resolve,reject) {
    setTimeout(function() {
      var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      var xmlHttp = new XMLHttpRequest();
      var count = 0
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            count += 1;
            if(xmlHttp.responseText != undefined) {
              resolve(JSON.parse(xmlHttp.responseText))
            }else if(count == 10) {
              reject({
                status: this.status,
                statusText: "too many retries"
              })
            }
          }
      }
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
    },5)

  })

}
