var _ = require('lodash');

//options : {only: [], except: []}
//only: only expose specified methods, disable others
//except: expose all methods, except specified ones
// symbol @ donates the method is static

module.exports  = function(Model, options) {
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

  methods = methods.concat(getRelationMethods(Model));

  if (options.only && options.only.length) {
    methods = _.difference(methods, options.only);
  }

  if (options.except && options.except.length) {
    methods = _.filter(methods, function(method){
      return _.includes(options.except, method);
    });
  }

  //always disable changeStream related endpoints
  methods.push('@createChangeStream');

  methods.forEach(function(method){
    if (/^@/.test(method)) {
      Model.disableRemoteMethod(method.replace(/^@/, ''), true);
    } else {
      Model.disableRemoteMethod(method, false);
    }
  });
}

function getRelationMethods(Model) {
  var relations = Model.definition.settings.relations;
  var remoteMethods = [];

  if (!relations) return remoteMethods;

  var hasManyPrefixs = [
    '__create__',
    '__get__',
    '__delete__',
    '__findById__',
    '__updateById__',
    '__destroyById__',
    '__count__',
    '__exists__',
    '__link__',
    '__unlink__'
  ];

  var hasOnePrefixs = [
    '__create__',
    '__get__',
    '__update__',
    '__destroy__'
  ];

  var belongsToPrefixs = [
    '__get__'
  ];

  Object.keys(relations).forEach(function(targetModel){
    switch(relations[targetModel].type) {
    case 'hasMany':
    case 'hasAndBelongsToMany':
      hasManyPrefixs.forEach(disableIt);
      break;
    case 'hasOne':
      hasOnePrefixs.forEach(disableIt);
      break;
    case 'belongsTo':
      belongsToPrefixs.forEach(disableIt);
      break;
    }
    function disableIt(prefix) {
      remoteMethods.push(prefix+targetModel);
    }
  })

  return remoteMethods;
}
