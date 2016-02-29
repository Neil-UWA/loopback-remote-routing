var getRemoteMethods = require('../util.js');
var expect = require('chai').expect;

describe('getRemoteMethods', function() {
  var Product = {
    modelName: 'product',
    definition: { settings: {
      relations:  {
        shop: {
          type: 'belongsTo',
          model: 'shop'
        }
      }
    }}
  };

  var ShopOwner = {
    modelName: 'shopOwner',
    definition: { settings: {
      relations:  {
        shop: {
          type: 'hasOne',
          model: 'shop'
        }
      }
    }}
  };

  var Shop = {
    modelName: 'shop',
    definition: { settings: {
      relations:  {
        products: {
          type: 'hasMany',
          model: 'product'
        }
      }
    }}
  }

  describe('belongsTo', function() {
    it('returns remoteMethods for belongsTo relation', function() {
      expect(getRemoteMethods(Product)).to.eql([
        '__get__shop'
      ])
    });
  });

  describe('hasOne', function() {
    it('returns remoteMethods for hasOne relation', function() {
      expect(getRemoteMethods(ShopOwner)).to.eql([
        '__create__shop',
        '__get__shop',
        '__update__shop',
        '__destroy__shop'
      ])
    });
  });

  describe('hasMany', function() {
    it('returns remoteMethods for hasMany relation', function() {
      expect(getRemoteMethods(Shop)).to.eql([
        '__count__products',
        '__create__products',
        '__delete__products',
        '__destroyById__products',
        '__findById__products',
        '__get__products',
        '__updateById__products'
      ])
    });
  });

  describe('hasMany', function() {
    it('returns remoteMethods for hasMany relation', function() {
      expect(getRemoteMethods(Shop)).to.eql([
        '__count__products',
        '__create__products',
        '__delete__products',
        '__destroyById__products',
        '__findById__products',
        '__get__products',
        '__updateById__products'
      ])
    });
  });
});
