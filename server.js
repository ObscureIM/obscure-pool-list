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

var schema = mongoose.schema;

var poolSchema = new mongoose.Schema({
  name: String,
  miners: Number,
  fee: Number,
  minPayment: Number,
  lastblock: Number,
  totalblocks: Number
})
//define  the model
var poolModel = mongoose.model('poolModel',poolSchema)

function updateDatabase() {
  theUrl = "https://raw.githubusercontent.com/ObscureIM/obscure-pool-list/master/list.json#"
  httpGetAsync(theUrl).then(function(fufilled) {
    //fufilled is the list of all pool nodes
    for(var i=0;i<fufilled.length;i++) {
      //fufilled.length.api is the current api link in the loop
      currentPool = fufilled[i]
      httpGetAsync(currentPool.api).then((json) => {
        var poolInfo = {
          name: currentPool.name,
          miners:json.pool.miners,
          fee:json.config.fee,
          minPayment:json.config.minPaymentThreshold,
          lastblock:json.pool.stats.lastBlockFound,
          totalblocks:json.pool.totalBlocks,
        }
        //instantiate the model
        console.log(poolInfo)
        var current_instance = new poolModel(poolInfo)

        current_instance.save(function(err) {
          if(err) return handleError(err);

        })
      }).catch((error) => {
        console.log(error)
      })
    }
  }).catch((error) => {
    console.log(error)
  })
}

function httpGetAsync(theUrl) {
  return new Promise(function(resolve,reject) {
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
  })

}
updateDatabase()
