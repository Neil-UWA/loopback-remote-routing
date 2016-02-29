var getRemoteMethods = require('../lib/util.js');
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

  describe('hasManyThrough', function() {
    it('returns remoteMethods for hasManyThrough relation', function() {
      expect(getRemoteMethods(Customer)).to.eql([
        '__exists__collected_products',
        '__link__collected_products',
        '__unlink__collected_products',
        '__count__collected_products',
        '__create__collected_products',
        '__delete__collected_products',
        '__destroyById__collected_products',
        '__findById__collected_products',
        '__get__collected_products',
        '__updateById__collected_products'
      ])
    });
  });

  describe('hasAndBelongsToMany', function() {
    it('returns remoteMethods for hasAndBelongsToMany relation', function() {
      expect(getRemoteMethods(Category)).to.eql([
        '__exists__tags',
        '__link__tags',
        '__unlink__tags',
        '__count__tags',
        '__create__tags',
        '__delete__tags',
        '__destroyById__tags',
        '__findById__tags',
        '__get__tags',
        '__updateById__tags'
      ])
    });
  });

  describe('embedsOne', function() {
    it('returns remoteMethods for embedsOne relation', function() {
      expect(getRemoteMethods(Item)).to.eql([
        '__create__slug',
        '__get__slug',
        '__update__slug',
        '__destroy__slug'
      ])
    });
  });

  describe('embedsMany', function() {
    it('returns remoteMethods for embedsMany relation', function() {
      expect(getRemoteMethods(User)).to.eql([
        '__create__addresses',
        '__get__addresses',
        '__delete__addresses',
        '__findById__addresses',
        '__updateById__addresses',
        '__destroyById__addresses',
        '__count__addresses'
      ])
    });
  });

  describe('referencesMany', function() {
    it('returns remoteMethods for referencesMany relation', function() {
      expect(getRemoteMethods(Palatee)).to.eql([
        '__exists__colors',
        '__link__colors',
        '__unlink__colors',
        '__count__colors',
        '__create__colors',
        '__delete__colors',
        '__destroyById__colors',
        '__findById__colors',
        '__get__colors',
        '__updateById__colors'
      ])
    });
  });

});
