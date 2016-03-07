# loopback-remote-routing
[![Circle CI](https://circleci.com/gh/Neil-UWA/loopback-remote-routing/tree/master.svg?style=svg)](https://circleci.com/gh/Neil-UWA/loopback-remote-routing/tree/master)

Easily disable remote methods.

##Features

- selectively disable remote methods created by *relations*, defined by code or in definition
- selectively disable remote methods created by *scopes* , defined by code or in definition

##Installation

```bash
npm install loopback-remote-routing --save
```

##How to use

```js

// common/models/color.js
var RemoteRouting = require('loopback-remote-routing');

module.exports = function(Color) {
  // use only to expose specified remote methods
  // symbol @ denotes static method
  // scope methods are static method
  Model.on('attached', function(){
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
  });

}

```

You can only use options.only or options.except, do not use them together.
