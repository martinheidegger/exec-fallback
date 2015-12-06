'use strict'

var tap = require('tap')
var fb = require('../')
var path = require('path')

tap.test('no-fallback test', function (t) {
  var f = fb(function () { return 'foo' }, 'error')
  f(function (error, result) {
    t.equal(error, null)
    t.equal(result, 'foo')
    t.end()
  })
})

tap.test('zalgo no-fallback test', function (t) {
  var f = fb(function () { return 'error' }, 'error')
  var a = 'foo'
  f(function (error, result) {
    t.equal(error, null)
    t.equal(a, 'bar')
    t.end()
  })
  a = 'bar'
})

tap.test('fallback test', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'baz.sh'))
  f(function (error, result) {
    t.equal(error, null)
    t.equal(result, 'baz')
    t.end()
  })
})

tap.test('null fallback test', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'empty.sh'))
  f(function (error, result) {
    t.equal(error, null)
    t.equal(result, '')
    t.end()
  })
})

tap.test('fallback data trim test', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'untrimmed.sh'))
  f(function (error, result) {
    t.equal(error, null)
    t.equal(result, 'fou')
    t.end()
  })
})

tap.test('fast succession', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'delayed.sh'))
  t.plan(3)
  f(function (e, result) {
    t.equal(result, 'foo')
  })
  setTimeout(function () {
    f(function (e, result) {
      t.equal(result, 'foo')
    })
  }, 1)
  setTimeout(function () {
    f(function (e, result) {
      t.equal(result, 'foo')
    })
  }, 2)
})

tap.test('one call only to fast t', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'now.sh'))
  var firstResult = null
  f(function (e, result) {
    firstResult = result
  })
  setTimeout(function () {
    f(function (e, result) {
      t.notEqual(firstResult, null)
      t.equal(result, firstResult)
      t.end()
    })
  }, 200)
})
