
'use strict'
const request = require('request-promise-native')
const util = require('util')



var ObscurePoolRpc = function (opts) {
  opts = opts || {}
  if (!(this instanceof ObscurePoolRpc)) return new ObscurePoolRpc(opts)
  this.host = opts.host || '127.0.0.1'
  this.port = opts.port || 11898
  this.timeout = opts.timeout || 2000
  this.ssl = opts.ssl || false
  this.enableCors = opts.enableCors || true
}

ObscurePoolRpc.prototype.getStats = function(opts) {
  return new Promise((resolve,reject) => {
    var url = this.host + ':8080' + '/poolList'
    console.log(url)
    this._post(url).then((result) => {
      return resolve(result)
    }).catch((error) => {
      return reject(error)
    })
  })
}

ObscurePoolRpc.prototype._post = function (url, params) {
  return new Promise((resolve, reject) => {
    if (url.length === 0) return reject(new Error('no url supplied'))
    params = params || {}
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            return JSON.parse(xmlHttp.responseText);
    }

    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
  })
}

module.exports = ObscurePoolRpc
