var prefixes = require('./prefixes.js');

module.exports = function RemoteMethods(Model) {
  var remoteMethods = [];

  var settings = Model.definition.settings;
  var relations = settings.relations;

  // get scope methods, defined by Model.scope() or defined in Model definition
  Object.keys(Model).forEach(function(property) {
    if(/^__(get|create|delete|update|count)__\w*/.test(property)) {
      remoteMethods.push(property);
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
