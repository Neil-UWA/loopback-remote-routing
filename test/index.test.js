var loopback = require('loopback');
var RemoteRouting = require('../index.js');
var expect  = require('chai').expect;
var app = loopback();
var _ = require('lodash');

app.set('legacyExplorer', false)
app.use(loopback.rest());

//WIP more tests
describe('RemoteRouting', function(){
  var Color = null;
  var Palatee = null;
  var PalateeColor = null;
  var db = null;
  var allColorRoutes = null;

  beforeEach(function(){
    db = app.dataSource('db', {adapter: 'memory'});

    Color = app.registry.createModel('color');
    app.model(Color, {
      name: String,
      scopes: {
        whiteColors: {
          where: {
            name: 'white'
          }
        }
      },
      relations: {
        palatee: {
          type: 'belongsTo',
          model: 'palatee'
        },
        dazzleColor: {
          type: 'hasOne',
          model: 'color'
        },
        nightPalatee: {
          type: 'hasAndBelongsToMany',
          model: 'palatee'
        },
        rgbColor: {
          type: 'embedsMany',
          model: 'color'
        },
        linkedColors: {
          type: 'referencesMany',
          model: 'color'
        }
      },
      dataSource: 'db'
    });

    PalateeColor = app.registry.createModel('PalateeColor');
    app.model(PalateeColor, {
      relations: {
        color: {
          type: 'belongsTo',
          model: 'color'
        },
        palatee: {
          type: 'belongsTo',
          model: 'palatee'
        }
      },
      dataSource: 'db'
    })

    Palatee = app.registry.createModel('palatee');
    app.model(Palatee, {
      name: String,
      relations: {
        colors: {
          type: 'hasMany',
          model: 'color'
        },
        awesomeColors: {
          type: 'hasMany',
          model: 'color',
          through: 'PalateeColor'
        },
        nightColors: {
          type: 'hasAndBelongsToMany',
          model: 'color'
        }
      },
      dataSource: 'db'
    });

    Color.embedsOne(Color, {as: 'embededColor'});
    Color.hasMany(Palatee, {as: 'colorWheels'});
    Color.scope('yellow', {
      where: {name: 'yellow'}
    });

    allColorRoutes = getModelRest(Color);
  });

  describe('only option', function(){
    beforeEach(function(){
      RemoteRouting(Color, {only: [
        '@create',
        '__get__colorWheels',
        '__get__embededColor',
        '@__get__whiteColors',
        '@__get__yellow'
      ]});
    });

    it('should only expose specified remote methods', function(){
      Color.on('attached', function() {
        var colorRoutes = getModelRest(Color);
        var remoteMethods = colorRoutes.map(function(router){
          return router.method;
        });
        expect(colorRoutes.length).to.eql(5);
        expect(remoteMethods).to.have.members([
          'color.create',
          'color.__get__whiteColors',
          'color.__get__yellow',
          'color.prototype.__get__colorWheels',
          'color.prototype.__get__embededColor'
        ]);
      });
    });
  });

  describe('expect option', function(){
    beforeEach(function(){
      RemoteRouting(Color, {except: ['@create', '@find']});
    });

    it('should expose all remote methods except specified ones', function(){
      Color.on('attached', function() {
        var colorRoutes = getModelRest(Color);
        expect(allColorRoutes.length - colorRoutes.length).to.eql(2);
        colorRoutes.forEach(function(endpoint){
          expect(endpoint.method).to.satisfy(function(method){
            return method !== 'color.create' && method !== 'colore.find';
          })
        });
      });
    });
  });

  function getModelRest(Model){
    return app.handler('rest').adapter.allRoutes().filter(function(endpoint){
      var reg = new RegExp('^'+Model.modelName);
      return reg.test(endpoint.method);
    })
  }
});
