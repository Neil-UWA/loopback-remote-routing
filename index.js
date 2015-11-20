var _ = require('lodash');

//options : {only: [], except: []}
//only: only expose specified methods, disable others
//except: expose all methods, except specified ones

module.exports  = function(Model, options) {
  var nonStatic = [];
  var isStatic =[
    'create',
    'upsert',
    'exists',
    'findById',
    'deleteById',
    'count',
    'find',
    'findOne',
    'createChangeStream',
    'updateAll'
  ]

  if (Model.modelName === 'User' || Model.base.modelName === 'User') {
    isStatic = _(isStatic).concat([
      'login',
      'logout',
      'confirm',
      'resetPassword']).value();
  }

  var nonStatic = getNonStaticMethods(Model);
  if (options.only && options.only.length) {
    isStatic = _.difference(isStatic, options.only);
    nonStatic = _.difference(nonStatic, options.only);
  }

  if (options.except && options.except.length) {
    isStatic = _.filter(isStatic, function(method){
      return _.includes(options.except, method);
    });

    nonStatic = _.filter(nonStatic, function(method){
      return _.includes(options.except, method);
    });
  }

  //always disable changeStream related endpoints
  isStatic.push('createChangeStream');

  isStatic.forEach(function(method){
    Model.disableRemoteMethod(method, true);
  });

  nonStatic.forEach(function(method){
    Model.disableRemoteMethod(method, false);
  });
}

function getNonStaticMethods(Model) {
  var relations = Model.definition.settings.relations;
  var remoteMethods = ['updateAttributes'];

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
