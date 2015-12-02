var loopback = require('loopback');
var RemoteRouting = require('../index.js');
var expect  = require('chai').expect;
var app = loopback();
var _ = require('lodash');

app.set('legacyExplorer', false)
app.use(loopback.rest());

describe('RemoteRouting', function(){
  var Color = null;
  var Palatee = null;
  var PalateeColor = null;
  var db = null;
  var allColorRoutes = null;

  beforeEach(function(){
    db = app.dataSource('db', {adapter: 'memory'});

    Color = app.model('color', {
      name: String,
      relations: {
        palatee: {
          type: 'belongsTo',
          model: 'palatee'
        },
        colorWheels: {
          type: 'hasMany',
          model: 'palatee',
          through: 'PalateeColor'
        },
        dazzleColor: {
          type: 'hasOne',
          model: 'color'
        },
        nightPalatee: {
          type: 'hasAndBelongsToMany',
          model: 'palatee'
        }
      },
      dataSource: 'db'
    });

    PalateeColor = app.model('PalateeColor', {
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

    Palatee = app.model('palatee', {
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

    app.model(Color);
    app.model(PalateeColor);
    app.model(Palatee);

    allColorRoutes = getModelRest(Color);
  });

  describe('only option', function(){
    beforeEach(function(){
      RemoteRouting(Color, {only: ['@create', '__get__colorWheels']});
    });

    it('should only expose specified remote methods', function(){
      var colorRoutes = getModelRest(Color);
      var remoteMethods = colorRoutes.map(function(router){
        return router.method;
      });
      expect(colorRoutes.length).to.eql(2);
      expect(remoteMethods).to.have.members([ 'color.create',  'color.prototype.__get__colorWheels'])
    });
  });

  describe('expect option', function(){
    beforeEach(function(){
      RemoteRouting(Color, {except: ['@create', '@find']});
    });

    it('should expose all remote methods except specified ones', function(){
      var colorRoutes = getModelRest(Color);
      expect(allColorRoutes.length - colorRoutes.length).to.eql(2);
      colorRoutes.forEach(function(endpoint){
        expect(endpoint.method).to.satisfy(function(method){
          return method !== 'color.create' && method !== 'colore.find';
        })
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
