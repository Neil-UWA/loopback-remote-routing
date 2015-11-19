var _ = require('lodash');

module.exports  = function(Model, options) {
  var nonStatic = [];
  //only: only expose specified methods, disable others
  //except: expose all methods, except specified ones
  options = {
    only: [],
    except: []
  }

  var isStatic =[
    'create',
    'upsert',
    'exists',
    'findById',
    'deleteById',
    'createChangeStream',
    'count',
    'find',
    'findOne',
    'updateAll'
  ]

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

  isStatic.forEach(method=>{
    Model.disableRemoteMethod(method, true);
  });

  nonStatic.forEach(method=>{
    Model.disableRemoteMethod(method, false);
  });
}

function getNonStaticMethods(Model) {
  var relations = Model.definition.settings.relations;
  var remoteMethods = ['updateAttributes'];
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
      hasManyPrefixs.forEach(function(prefix){
        remoteMethods.push(prefix+targetModel);
      });
      break;
    case 'hasOne':
      hasOnePrefixs.forEach(function(prefix){
        remoteMethods.push(prefix+targetModel);
      });
      break;
    case 'belongsTo':
      belongsToPrefixs.forEach(function(prefix){
        remoteMethods.push(prefix+targetModel);
      });
      break;
    }
  })

  return remoteMethods;
}
