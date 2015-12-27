# loopback-remote-routing
[![Circle CI](https://circleci.com/gh/Neil-UWA/loopback-remote-routing/tree/master.svg?style=svg)](https://circleci.com/gh/Neil-UWA/loopback-remote-routing/tree/master)

Easily disable remote methods.

##Installation

```bash
npm install loopback-remote-routing --save
```

##How to use

```js
Works with embeded relations now

// common/models/color.js
var RemoteRouting = require('loopback-remote-routing');

module.exports = function(Color) {
  // use only to expose specified remote methods
  // symbol @ denotes static method
  RemoteRouting(Color, {only: [
    '@find',
    '@findById',
    'updateAttributes'
  ]})

  //use except to expose all remote methods except specified ones
  RemoteRouting(Color, {except: [
    '@create',
    '@find'
  ]}

  //disable all remote methods omitting options

  RemoteRouting(Color)
}
```
you can only use options.only or options.except, do not use them together.
