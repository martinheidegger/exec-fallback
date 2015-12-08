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
function regularCall() {
    return config.path
}
var myConfigPath = fb(regularCall, 'pwd')
```

since the fallback is an async exec command you need to register a callback hook to get the value

```JavaScript
myConfigPath(function (error, value) {
  // there will never be an error,
})
```

## Caching & Invalidation
The result will be cached by default for **10 minutes**. You can change the cache time by passing in a third parameter.

```JavaScript
var myConfigPath = fb(regularCall, 'pwd', 100000)
```

It is also possible to invalidate the currently cached value.

```JavaScript
myConfigPath.invalidate()
```


## License

ISC

Originally inspired by [osenv](https://github.com/npm/osenv).