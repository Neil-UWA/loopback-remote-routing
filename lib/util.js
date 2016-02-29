var prefixes = require('./prefixes.js');

module.exports = function getRemoteMethods(Model) {
  var remoteMethods = [];

  var settings = Model.definition.settings;
  var relations = settings.relations;

  if (!relations) return remoteMethods;

  Object.keys(relations).forEach(function(targetModel){
    var type =
      relations[targetModel].through ? 'hasManyThrough' : relations[targetModel].type;

    prefixes[type] && prefixes[type].forEach(function(prefix) {
      remoteMethods.push(prefix+targetModel);
    });
  })

  return remoteMethods;
}
