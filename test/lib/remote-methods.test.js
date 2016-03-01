var RemoteMethods = require('../../lib/remote-methods.js');
var prefixes = require('../../lib/prefixes.js');
var expect = require('chai').expect;
var app = require('loopback')();

describe('RemoteMethods', function() {

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

  var Category = {
    modelName: 'shopOwner',
    definition: { settings: {
      relations:  {
        tags: {
          type: 'hasAndBelongsToMany',
          model: 'tag'
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

  var Customer = {
    modelName: 'customer',
    definition: { settings: {
      relations:  {
        collected_products: {
          type: 'hasMany',
          model: 'product',
          through: 'collection'
        }
      }
    }}
  };

  var User = {
    modelName: 'user',
    definition: { settings: {
      relations:  {
        addresses: {
          type: 'embedsMany',
          model: 'address'
        }
      }
    }}
  }

  var Palatee = {
    modelName: 'palatee',
    definition: { settings: {
      relations:  {
        colors: {
          type: 'referencesMany',
          model: 'color'
        }
      }
    }}
  }
  var Collection = {
    modelName: 'collection',
    definition: { settings: {
      relations:  {
        collector: {
          type: 'belongsTo',
          model: 'customer'
        },
        product: {
          type: 'belongsTo',
          model: 'product'
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

  var Item = {
    modelName: 'item',
    definition: { settings: {
      relations:  {
        slug: {
          type: 'embedsOne',
          model: 'slug'
        }
      }
    }}
  }

  var Comment = {
    modelName: 'comment',
    __get__latest_comments: function() {},
    __create__latest_comments: function() {},
    __count__latest_comments: function() {},
    __delete__latest_comments: function() {},
    definition: { settings: {
      scopes:  {
        latest_comments: {
          order: 'updated_at DESC'
        }
      }
    }}
  }

  describe('belongsTo', function() {
    it('returns remoteMethods for belongsTo relation', function() {
      var remoteMethods = prefixes.belongsTo.map(remoteMethod.bind(null, 'shop'));
      expect(RemoteMethods(Product)).to.eql(remoteMethods);
    });
  });

  describe('hasOne', function() {
    it('returns remoteMethods for hasOne relation', function() {
      var remoteMethods = prefixes.hasOne.map(remoteMethod.bind(null, 'shop'));
      expect(RemoteMethods(ShopOwner)).to.eql(remoteMethods);
    });
  });

  describe('hasMany', function() {
    it('returns remoteMethods for hasMany relation', function() {
      var remoteMethods = prefixes.hasMany.map(remoteMethod.bind(null, 'products'));
      expect(RemoteMethods(Shop)).to.eql(remoteMethods);
    });
  });

  describe('hasManyThrough', function() {
    it('returns remoteMethods for hasManyThrough relation', function() {
      var remoteMethods = prefixes.hasManyThrough.map(remoteMethod.bind(null, 'collected_products'));
      expect(RemoteMethods(Customer)).to.eql(remoteMethods);
    });
  });

  describe('hasAndBelongsToMany', function() {
    it('returns remoteMethods for hasAndBelongsToMany relation', function() {
      var remoteMethods = prefixes.hasAndBelongsToMany.map(remoteMethod.bind(null, 'tags'));
      expect(RemoteMethods(Category)).to.eql(remoteMethods);
    });
  });

  describe('embedsOne', function() {
    it('returns remoteMethods for embedsOne relation', function() {
      var remoteMethods = prefixes.embedsOne.map(remoteMethod.bind(null, 'slug'));
      expect(RemoteMethods(Item)).to.eql(remoteMethods);
    });
  });

  describe('embedsMany', function() {
    it('returns remoteMethods for embedsMany relation', function() {
      var remoteMethods = prefixes.embedsMany.map(remoteMethod.bind(null, 'addresses'));
      expect(RemoteMethods(User)).to.eql(remoteMethods);
    });
  });

  describe('referencesMany', function() {
    it('returns remoteMethods for referencesMany relation', function() {
      var remoteMethods = prefixes.referencesMany.map(remoteMethod.bind(null, 'colors'));
      expect(RemoteMethods(Palatee)).to.eql(remoteMethods);
    });
  });

  describe('scopes', function() {
    it('returns all remoteMethods declared in scopes or by Model.scope', function() {
      var remoteMethods = prefixes.scopes.map(function(prefix) {
        return ['@', prefix, 'latest_comments'].join('');
      });
      expect(RemoteMethods(Comment)).to.eql(remoteMethods);
    });
  });

  function remoteMethod (target, prefix) {
    return [prefix, target].join('');
  }

});
