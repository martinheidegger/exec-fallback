'use strict'
var exec = require('child_process').exec

module.exports = function (method, fallback, maxAge) {
  maxAge = (isNaN(maxAge) ? 600000 : maxAge) | 0 // 1000ms * 60s * 10m
  var callbacks, val, invalidBy
  var result = function (cb) {
    if (cb) {
      if (callbacks !== undefined) {
        callbacks.push(cb)
        return
      }
      if (Date.now() < invalidBy) {
        process.nextTick(cb.bind(null, null, val))
        return
      }
      val = method()
      if (val === null || val === undefined || val === '') {
        callbacks = [cb]
        exec(fallback, function (err, output) {
          val = err ? undefined : output.trim()
          invalidBy = (Date.now() + maxAge)
          var cbx = callbacks
          callbacks = undefined
          cbx.forEach(function (cb) {
            cb(null, val)
          })
        })
      } else {
        invalidBy = (Date.now() + maxAge)
        process.nextTick(cb.bind(null, null, val))
      }
    }
  }
  result.invalidate = function () {
    invalidBy = 0
  }
  return result
}
