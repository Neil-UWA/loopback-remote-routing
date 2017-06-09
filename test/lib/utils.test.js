var utils = require('../../lib/utils.js');
var prefixes = require('../../lib/prefixes.js');
var expect = require('chai').expect;
var app = require('loopback')();
var db = app.dataSource('db', {adapter: 'memory'});

describe('Utils', function() {

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

  var Category = app.registry.createModel('category');
  app.model(Category, {
    relations:  {
      tags: {
        type: 'hasAndBelongsToMany',
        model: 'tag'
      }
    },
    dataSource: 'db'
  });

  var ShopOwner = app.registry.createModel('shopOwner');
  app.model(ShopOwner, {
    relations:  {
      shop: {
        type: 'hasOne',
        model: 'shop'
      }
    },
    dataSource: 'db'
  })

  var Customer = app.registry.createModel('customer');
  app.model(Customer, {
    relations:  {
      collected_products: {
        type: 'hasMany',
        model: 'product',
        through: 'collection'
      }
    },
    dataSource: 'db'
  });

  var User = app.registry.createModel('user');
  app.model(User, {
    relations:  {
      addresses: {
        type: 'embedsMany',
        model: 'address'
      }
    },
    dataSource: 'db'
  });

  var Palatee = app.registry.createModel('palatee');
  app.model(Palatee, {
    relations:  {
      colors: {
        type: 'referencesMany',
        model: 'color'
      }
    },
    dataSource: 'db'
  });

  var Collection = app.registry.createModel('collection');
  app.model(Collection, {
    relations:  {
      collector: {
        type: 'belongsTo',
        model: 'customer'
      },
      product: {
        type: 'belongsTo',
        model: 'product'
      }
    },
    dataSource: 'db'
  });

  var Shop = app.registry.createModel('shop');
  app.model(Shop, {
    relations:  {
      products: {
        type: 'hasMany',
        model: 'product'
      }
    },
    dataSource: 'db'
  });

  var Item = app.registry.createModel('item');
  app.model(Item, {
    relations:  {
      slug: {
        type: 'embedsOne',
        model: 'slug'
      }
    },
    dataSource: 'db'
  });

  var Comment = app.registry.createModel('comment', {}, {
    scopes: {
      latest_comments: {
        order: 'updated_at DESC'
      }
    }
  });
  app.model(Comment, {
    dataSource: 'db'
  })

  describe('.relationMethods', function() {
    describe('belongsTo', function() {
      it('returns remoteMethods for belongsTo relation', function() {
        var remoteMethods = prefixes.belongsTo.map(remoteMethod.bind(null, 'shop'));
        expect(utils.relationMethods(Product)).to.eql(remoteMethods);
      });
    });

    describe('hasOne', function() {
      it('returns remoteMethods for hasOne relation', function() {
        var remoteMethods = prefixes.hasOne.map(remoteMethod.bind(null, 'shop'));
        expect(utils.relationMethods(ShopOwner)).to.eql(remoteMethods);
      });
    });

    describe('hasMany', function() {
      it('returns remoteMethods for hasMany relation', function() {
        var remoteMethods = prefixes.hasMany.map(remoteMethod.bind(null, 'products'));
        expect(utils.relationMethods(Shop)).to.eql(remoteMethods);
      });
    });

    describe('hasManyThrough', function() {
      it('returns remoteMethods for hasManyThrough relation', function() {
        var remoteMethods = prefixes.hasManyThrough.map(remoteMethod.bind(null, 'collected_products'));
        expect(utils.relationMethods(Customer)).to.eql(remoteMethods);
      });
    });

    describe('hasAndBelongsToMany', function() {
      it('returns remoteMethods for hasAndBelongsToMany relation', function() {
        var remoteMethods = prefixes.hasAndBelongsToMany.map(remoteMethod.bind(null, 'tags'));
        expect(utils.relationMethods(Category)).to.eql(remoteMethods);
      });
    });

    describe('embedsOne', function() {
      it('returns remoteMethods for embedsOne relation', function() {
        var remoteMethods = prefixes.embedsOne.map(remoteMethod.bind(null, 'slug'));
        expect(utils.relationMethods(Item)).to.eql(remoteMethods);
      });
    });

    describe('embedsMany', function() {
      it('returns remoteMethods for embedsMany relation', function() {
        var remoteMethods = prefixes.embedsMany.map(remoteMethod.bind(null, 'addresses'));
        expect(utils.relationMethods(User)).to.eql(remoteMethods);
      });
    });

    describe('referencesMany', function() {
      it('returns remoteMethods for referencesMany relation', function() {
        var remoteMethods = prefixes.referencesMany.map(remoteMethod.bind(null, 'colors'));
        expect(utils.relationMethods(Palatee)).to.eql(remoteMethods);
      });
    });

  });

  describe('.scopeMethods', function() {
    it('returns all remoteMethods declared in scopes or by Model.scope', function() {
      var remoteMethods = prefixes.scopes.map(function(prefix) {
        return ['@', prefix, 'latest_comments'].join('');
      });
      expect(utils.scopeMethods(Comment)).to.eql(remoteMethods);
    });
  });

  describe('.defaultMethods', function() {
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
      'updateAttributes',
      '@replaceById',
      '@replaceOrCreate',
      '@upsertWithWhere'
    ];
    it('returns default methods',  function() {
      expect(utils.defaultMethods(Comment)).to.eql(defaultMethods);
    });

    it('adds methods for models with base Model User', function(){
      var Client = app.registry.createModel('client', {}, {base: 'User'});
      app.model(Client, {
        dataSource: 'db'
      });
      expect(utils.defaultMethods(Client)).to.eql(defaultMethods.concat([
        '@login',
        '@logout',
        '@confirm',
        '@resetPassword',
        '@changePassword',
        '@setPassword',
        'verify'
      ]));
    });
  });

  function remoteMethod (target, prefix) {
    return [prefix, target].join('');
  }

});
