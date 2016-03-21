var utils = require('./utils.js');

module.exports = function RemoteMethods(Model) {
  var remoteMethods = [];

  remoteMethods = remoteMethods.concat(utils.defaultMethods(Model));
  remoteMethods = remoteMethods.concat(utils.scopeMethods(Model));
  remoteMethods = remoteMethods.concat(utils.relationMethods(Model));

  return remoteMethods;
}
