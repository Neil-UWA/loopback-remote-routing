var _ = require('lodash');
var getRemoteMethods = require('./lib/util.js');

//options : {only: [], except: []}
//only: only expose specified methods, disable others
//except: expose all methods, except specified ones
//symbol @ donates the method is static

module.exports  = function RemoteRouting(Model, options) {
  options = options || {};

  var methods =[
    '@create',
    '@upsert',
    '@exists',
    '@findById',
    '@deleteById',
    '@count',
    '@find',
    '@findOne',
    '@createChangeStream',
    '@updateAll',
    'updateAttributes'
  ]

  if (Model.modelName === 'User' || Model.base.modelName === 'User') {
    methods = _(methods).concat([
      '@login',
      '@logout',
      '@confirm',
      '@resetPassword']).value();
  }

  methods = methods.concat(getRemoteMethods(Model));

  if (options.only && options.only.length) {
    methods = _.difference(methods, options.only);
  }

  if (options.except && options.except.length) {
    methods = _.filter(methods, function(method){
      return _.includes(options.except, method);
    });
  }

  methods.forEach(function(method){
    if (/^@/.test(method)) {
      Model.disableRemoteMethod(method.replace(/^@/, ''), true);
    } else {
      Model.disableRemoteMethod(method, false);
    }
  });
}

