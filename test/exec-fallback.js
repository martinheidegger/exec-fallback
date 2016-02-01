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

tap.test('error fallback test', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'error.sh'))
  f(function (error, result) {
    t.equal(error, null)
    t.equal(result, undefined)
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
  t.plan(6)
  f(function (err, result) {
    t.equal(err, null)
    t.equal(result, 'foo')
  })
  setTimeout(function () {
    f(function (err, result) {
      t.equal(err, null)
      t.equal(result, 'foo')
    })
  }, 1)
  setTimeout(function () {
    f(function (err, result) {
      t.equal(err, null)
      t.equal(result, 'foo')
    })
  }, 2)
})

tap.test('usual cache behavior', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'now.sh'))
  var firstResult = null
  f(function (e, result) {
    firstResult = result
    setTimeout(function () {
      f(function (err, result) {
        t.equal(err, null)
        t.notEqual(firstResult, null)
        t.equal(result, firstResult)
        t.end()
      })
    }, 10)
  })
})

tap.test('allow invalidation of cache after time', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'now.sh'), 20)
  var firstResult = null
  f(function (e, result) {
    firstResult = result
    setTimeout(function () {
      f(function (err, result) {
        t.equal(err, null)
        t.notEqual(result, firstResult)
        t.notEqual(result, null)
        t.end()
      })
    }, 25)
    setTimeout(function () {
      f(function (err, result) {
        t.equal(err, null)
        t.notEqual(firstResult, null)
        t.equal(result, firstResult)
      })
    }, 5)
  })
})

tap.test('ensure order of calllbacks', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'delayed.sh'))
  var order = 0
  var count = 0
  var max = 100
  var done = function (nr) {
    t.equal(order, nr)
    order++
    if (order === max) {
      t.end()
    }
  }
  var next = function () {
    f(done.bind(null, count))
    count++
    if (count < max) {
      setTimeout(next, 2)
    }
  }
  next()
})

tap.test('manual invalidation', function (t) {
  var nr = 1
  var f = fb(function () { return nr }, path.join(__dirname, 'baz.sh'), 10000000)
  f(function (error, first) {
    t.equal(error, null)
    t.equal(first, 1)
    f(function (error, second) {
      t.equal(error, null)
      t.equal(first, second)
      nr = 3
      f.invalidate()
      nr = 4
      f(function (error, third) {
        t.equal(error, null)
        t.notEqual(first, third)
        t.equal(third, 4)
        t.end()
      })
      nr = 5
    })
    nr = 2
  })
})

tap.test('manual invalidation callback', function (t) {
  var f = fb(function () { return null }, path.join(__dirname, 'now.sh'), 10000000)
  f(function (error, first) {
    t.equal(error, null)
    t.notEqual(first, undefined)
    f(function (error, second) {
      t.equal(error, null)
      t.equal(first, second)
      f.invalidate()
      f(function (error, second) {
        t.equal(error, null)
        t.notEqual(first, second)
        t.notEqual(second, undefined)
        t.end()
      })
    })
  })
})

