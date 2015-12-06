'use strict'
var exec = require('child_process').exec

module.exports = function (method, fallback) {
  var fell = false
  var falling = false
  var val
  var result = function (cb) {
    if (!falling) {
      val = method()
    }
    if (val || fell) {
      return process.nextTick(cb.bind(null, null, val))
    }
    if (!falling) {
      falling = true
      exec(fallback, function (err, output) {
        fell = true
        if (err) {
          return // error, oh well, we tried
        }
        val = output.trim()
      })
    }
    setTimeout(result.bind(null, cb), 1)
  }
  return result
}
