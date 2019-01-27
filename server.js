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

const ObscurePoolRpc = require('./obscure-pool-rpc.js')
const daemon = new ObscurePoolRpc({
  host:"127.0.0.1",
  port: 8080, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false, // whether we need to connect using SSL/TLS
  enableCors: true
});
//first lets call the side-server hosting the list.JSON
//this script will be hosted on a side server
function httpGetAsync(theUrl)
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            console.log(xmlHttp.responseText)
            return xmlHttp.responseText;
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

app.get('/poolList',function(req,res) {
  theUrl = "https://raw.githubusercontent.com/ObscureIM/obscure-pool-list/master/list.json#"
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          res.send(JSON.parse(xmlHttp.responseText));

  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);

})

app.get('/poolStats',function(req,res) {
  daemon.getStats().then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
})
