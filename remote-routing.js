var _ = require('lodash');
var utils = require('./lib/utils.js');
var RemoteMethods = require('./lib/remote-methods.js');

module.exports = function(Model, options) {
  Model.on('attached', function() {
    RemoteRouting(Model, options);
  });
};

var remoteMethod = Model.remoteMethod;

Model.remoteMethod = function(name, config) {
  var disable;

  remoteMethod.call(Model, name, config);

  if (options.only && options.only.length) {
    disable = !_.includes(options.only, name);
  }

  if (options.only && options.only.length) {
    disable = disable || _.includes(options.except, name);
  }

  if (disable) {
    Model.disableRemoteMethod(name, /^prototype/.test(name));
  }
};

//options : {only: [], except: []}
//only: only expose specified methods, disable others
//except: expose all methods, except specified ones
//symbol @ donates the method is static

function RemoteRouting(Model, options) {
  options = options || {};

  var methods = RemoteMethods(Model);

  if (options.only && options.only.length) {
    methods = _.difference(methods, options.only);
  }

  if (options.except && options.except.length) {
    methods = _.filter(methods, function(method){
      return _.includes(options.except, method);
    });
  }

  methods.forEach(function(method){
    if(Model.disableRemoteMethodByName) {
      // since Model.disableRemoteMethod        has deprecated in loopback 3.X 
      // use   Model.disableRemoteMethodByName  instead
      if (/^@/.test(method)) {
        Model.disableRemoteMethodByName(method.replace(/^@/, ''));
      } else {
        Model.disableRemoteMethodByName('prototype.' + method);
      }
    } else {
      if (/^@/.test(method)) {
        Model.disableRemoteMethod(method.replace(/^@/, ''), true);
      } else {
        Model.disableRemoteMethod(method, false);
      }
    }    
  });
}
