
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

class testClass {
  constructor(opts) {
    this.opts = opts
  }
}


ObscurePoolRpc.prototype.getStats = function(opts) {
  return new Promise((resolve,reject) => {
    this._post('/list.json').then((result) => {
      return resolve(result)
    }).catch((error) => {
      return reject(error)
    })
  })
}

ObscurePoolRpc.prototype._post = function (method, params) {
  return new Promise((resolve, reject) => {
    if (method.length === 0) return reject(new Error('no method supplied'))
    params = params || {}

    var body = {
      jsonrpc: '2.0',
      method: method,
      params: params
    }

    this._rawPost('json_rpc', body).then((result) => {
      if (!result.error) {
        return resolve(result.result)
      } else {
        return reject(result.error.message)
      }
    }).catch((err) => {
      return reject(err)
    })
  })
}

ObscurePoolRpc.prototype._rawPost = function (endpoint, body) {
  return new Promise((resolve, reject) => {
    if (endpoint.length === 0) return reject(new Error('no endpoint supplied'))
    if (body === undefined) return reject(new Error('no body supplied'))
    var protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s/%s', protocol, this.host, this.port, endpoint),
      method: 'POST',
      body: body,
      json: true,
      timeout: this.timeout
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}
module.exports = ObscurePoolRpc
