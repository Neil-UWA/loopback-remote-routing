var loopback = require('loopback');
var RemoteRouting = require('../index.js');
var expect  = require('chai').expect;
var sinon = require('sinon');
var app = loopback();

app.set('legacyExplorer', false)

app.use(loopback.rest());

describe('RemoteRouting', function(){
  var Color = null;
  var Palatee = null;
  var db = null;
  var remoteEndpoints = null;

  db = app.dataSource('db', {adapter: 'memory'});

  Color = app.model('color', {name: String, relations: {
    palatee: {
      type: 'belongsTo',
      model: 'palatee'
    }
  }});

  Palatee = app.model('palatee', {name: String, relations: {
    colors: {
      type: 'hasMany',
      model: 'color'
    }
  }});

  db.attach(Color);
  db.attach(Palatee);

  describe('only option', function(){
    it('should only expose specified remote methods', function(){
      RemoteRouting(Color, {only: ['create']});
      expect(getModelRest(Color).length).to.eql(1);
    });
  });

  describe('expect option', function(){
    it('should expose all remote methods except specified ones', function(){
      RemoteRouting(Color, {except: ['create', 'find']});
      getModelRest(Color).forEach(function(endpoint){
        expect(endpoint.method).to.not.contain('color.create')
        expect(endpoint.method).to.not.contain('color.find')
      })
    });
  });

  function getModelRest(Model){
    return app.handler('rest').adapter.allRoutes().filter(function(endpoint){
      var reg = new RegExp('^'+Model.modelName);
      return reg.test(endpoint.method);
    })
  }
});
