var hasManyPrefixs;
var hasManyThroughPrefixs;
var hasAndBelongsToManyPrefixs;
var hasOnePrefixs;
var belongsToPrefixs;
var embedsManyPrefixs;
var embedsOnePrefixs;
var referencesManyPrefixs;
var scopesPrefixs;

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
  '__get__',
  '__create__',
  '__delete__',
  '__update__',
  '__count__'
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

module.exports = {
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
