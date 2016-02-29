module.exports = function getRemoteMethods(Model) {
  var remoteMethods = [];
  var hasManyPrefixs;
  var hasManyThroughPrefixs;
  var hasAndBelongsToManyPrefixs;
  var hasOnePrefixs;
  var belongsToPrefixs;
  var embedsManyPrefixs;
  var embedsOnePrefixs;
  var referencesManyPrefixs;
  var scopesPrefixs;

  var relations = Model.definition.settings.relations;
  var scopes = Object.keys(Model.definition.settings.scopes || {});

  if (!relations) return remoteMethods;

  belongsToPrefixs = [
    '__get__'
  ];

  hasManyPrefixs = [
    '__count__',
    '__create__',
    '__delete__',
    '__destroyById__',
    '__findById__',
    '__get__',
    '__updateById__'
  ];

  referencesManyPrefixs = hasAndBelongsToManyPrefixs = hasManyThroughPrefixs = [
    '__exists__',
    '__link__',
    '__unlink__'
  ].concat(hasManyPrefixs);

  scopesPrefixs = [
    '__create__',
    '__get__',
    '__count__',
    '__delete__'
  ]

  embedsOnePrefixs =hasOnePrefixs = [
    '__create__',
    '__get__',
    '__update__',
    '__destroy__'
  ];

  embedsManyPrefixs = [
    '__create__',
    '__get__',
    '__delete__',
    '__findById__',
    '__updateById__',
    '__destroyById__',
    '__count__'
  ];

  var box = {
    belongsTo: belongsToPrefixs,
    hasOne: hasOnePrefixs,
    hasMany: hasManyPrefixs,
    hasManyThrough: hasManyThroughPrefixs,
    hasAndBelongsToMany: hasAndBelongsToManyPrefixs,
    embedsOne: embedsOnePrefixs,
    embedsMany: embedsManyPrefixs,
    referencesMany: referencesManyPrefixs,
    scopes: scopesPrefixs
  };

  Object.keys(relations).forEach(function(targetModel){
    var type =
      relations[targetModel].through ? 'hasManyThrough' : relations[targetModel].type;

    box[type] && box[type].forEach(function(prefix) {
      remoteMethods.push(prefix+targetModel);
    });
  })

  scopes.length && scopes.forEach(function(scope) {
    scopePrefixs.forEach(function(prefix) {
      remoteMethods.push(prefix+scope);
    });
  });

  return remoteMethods;
}
