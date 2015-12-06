# exec-fallback [![Build Status](https://travis-ci.org/martinheidegger/exec-fallback.svg?branch=master)](https://travis-ci.org/martinheidegger/exec-fallback)

Tool to fallback to an `exec` command in case that a method doesn't return a satisfactory value

## Usage

Install with ...

```
$ npm install exec-fallback --save
```

and create a fallback in case a **synchronous** template is empty:

```JavaScript
var fb = require('exec-fallback')
var myFallback = fb(function () {
    // do something
}, 'fallback-command')
```

Here is a example where `pwd` is called in case a `config.path` property doesn't exist.

```JavaScript
var fb = require('exec-fallback')
var myFallback = fb(function () {
    return config.path
}, 'pwd')
```

The command will always return the same result. 

## License

ISC

Build based on the works of [osenv](https://github.com/npm/osenv).