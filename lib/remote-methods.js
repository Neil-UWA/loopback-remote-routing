var prefixes = require('./prefixes.js');


module.exports = function RemoteMethods(Model) {
  var remoteMethods = [];
  var settings = Model.definition.settings;
  var relations = settings.relations;
  var defaultMethods = [
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
  ];

  if (Model.modelName === 'User' || Model.base.modelName === 'User') {
    remoteMethods = remoteMethods.concat([
      '@login',
      '@logout',
      '@confirm',
      '@resetPassword'
    ]);
  }

  if (Model.dataSource.settings.connector === 'loopback-component-storage') {
    remoteMethods = remoteMethods.concat([
      '@download',
      '@getFile',
      '@getFiles',
      '@removeFile',
      '@getContainers',
      '@createContainer',
      '@destroyContainer',
      '@getContainer',
      '@upload'
    ]);
  }

  // get scope methods, defined by Model.scope() or defined in Model definition
  Object.keys(Model).forEach(function(property) {
    if(/^__(get|create|delete|update|count)__\w*/.test(property)) {
      remoteMethods.push(['@', property].join(''));
    };
  });

  // get remoteMethods defined by relations
  relations && Object.keys(relations).forEach(function(targetModel){
    var type =
      relations[targetModel].through ? 'hasManyThrough' : relations[targetModel].type;

    prefixes[type] && prefixes[type].forEach(function(prefix) {
      remoteMethods.push(prefix+targetModel);
    });
  })


  return remoteMethods;
}
