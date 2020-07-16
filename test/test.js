var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

const request = require('supertest');


const app = 'http://192.168.99.100:3000';





/*    TEST CASES:       */ 

describe('GET requests', function() {

    describe('GET /client', function () {
    
        it('return OK status (server reachable)', function() {
            return request(app)
              .get('/api/client')
              .then(function(response){
                  assert.equal(response.status, 200)
              })
          });
    
    
      
          it('GET request return type (json)', function(done) {
            request(app)
                .get('/api/client')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        
    
        it('GET request for single client (id = 55)', function(done) {
            request(app)
                .get('/api/client/55')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect({"ID": 55,
                "FIRST_NAME": "name 007",
                "SECOND_NAME": "surname 007",
                "LOGIN": "user 007",
                "PASS": "simplepass",
                "EMAIL": "email 007",
                "PHONE_NUM": 7,
                "BIRTH_DATE": "1999-12-02T00:00:00.000Z"})
                .expect(200, done);
        });
    
    
    
      });

    describe('GET /product', function () {
    
        it('return OK status (server reachable)', function() {
            return request(app)
              .get('/api/product')
              .then(function(response){
                  assert.equal(response.status, 200)
              })
          });
    
    
      
          it('GET request return type (json)', function(done) {
            request(app)
                .get('/api/product')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        
    
        it('GET request for single product (id = 36)', function(done) {
            request(app)
                .get('/api/product/36')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect({"ID": 36,
                "NAME": "product 001",
                "PRICE": 1,
                "DESCR": "simple description",
                "SPEC": "simple specs",
                "STOCK_NUM": 190,
                "URL": "dummyProductURL.com",
                "CATEG_ID": 33,
                "RATING": 4,
                "MANUFACTURER_ID": 39,
                "IS_ACTIVE": 1})
                .expect(200, done);
        });
    
    
    
      });


    describe('GET /categ', function () {
    
        it('return OK status (server reachable)', function() {
            return request(app)
              .get('/api/categ')
              .then(function(response){
                  assert.equal(response.status, 200)
              })
          });
    
    
      
          it('GET request return type (json)', function(done) {
            request(app)
                .get('/api/categ')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        
    
        it('GET request for single category (id = 35)', function(done) {
            request(app)
                .get('/api/categ/35')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect({"ID": 35,
                "NAME": "categ 002",
                "DESCR": "simple description"})
                .expect(200, done);
        });
    
    
    
      });

    
    
    describe('GET /manuf', function () {
    
        it('return OK status (server reachable)', function() {
            return request(app)
              .get('/api/manuf')
              .then(function(response){
                  assert.equal(response.status, 200)
              })
          });
    
    
      
          it('GET request return type (json)', function(done) {
            request(app)
                .get('/api/manuf')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        
    
        it('GET request for single manufacturer (id = 41)', function(done) {
            request(app)
                .get('/api/manuf/41')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect({ "ID": 41,
                "NAME": "company 002",
                "DESCR": "simple description",
                "LOGO_URL": "dummyURL.com"})
                .expect(200, done);
        });
    
    
    
      });


});





