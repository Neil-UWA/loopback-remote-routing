var RemoteMethods = require('../../lib/remote-methods.js');
var utils = require('../../lib/utils.js');
var expect = require('chai').expect;
var app = require('loopback')();
var db = app.dataSource('db', {adapter: 'memory'});

describe('RemoteMethods', function() {

  var Product = app.registry.createModel('product');
  app.model(Product, {
    relations:  {
      shop: {
        type: 'belongsTo',
        model: 'shop'
      }
    },
    dataSource: 'db'
  });

  it('returns remote methods for a model', function() {
    var expected = [].concat(
      utils.defaultMethods(Product),
      utils.relationMethods(Product)
    );
    expect(RemoteMethods(Product)).to.eql(expected);
  });
});
