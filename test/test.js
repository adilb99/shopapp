var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

const request = require('supertest');
const bodyParser = require('body-parser');

const app = 'http://192.168.99.100:3000';

// const express = require('express');
// const app = express();

// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());

// app.listen(3000, '192.168.99.100');

/*  FUNCTIONS (FOR LESS DUPLICATION):   */

function testGET(url, id, expected) {
    describe('GET /'.concat(url), function () {
    
        it('return OK status (server reachable)', function() {
            return request(app)
              .get('/api/'.concat(url))
              .then(function(response){
                  assert.equal(response.status, 200)
              })
          });
    
    
      
          it('GET request return type (json)', function(done) {
            request(app)
                .get('/api/'.concat(url))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        
    
        it('GET request for single '.concat(url, ' (id = ', id, ')'), function(done) {
            request(app)
                .get('/api/'.concat(url, '/', id))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(expected)
                .expect(200, done);
        });
    
    
    
      });
}


/*    TEST CASES:       */ 

describe('GET requests: ', function() {

    testGET('client', '55', {"ID": 55,
    "FIRST_NAME": "name 007",
    "SECOND_NAME": "surname 007",
    "LOGIN": "user 007",
    "PASS": "simplepass",
    "EMAIL": "email 007",
    "PHONE_NUM": 7,
    "BIRTH_DATE": "1999-12-02T00:00:00.000Z"});

    testGET('product', '36', {"ID": 36,
    "NAME": "product 001",
    "PRICE": 1,
    "DESCR": "simple description",
    "SPEC": "simple specs",
    "STOCK_NUM": 190,
    "URL": "dummyProductURL.com",
    "CATEG_ID": 33,
    "RATING": 4,
    "MANUFACTURER_ID": 39,
    "IS_ACTIVE": 1});

    testGET('categ', '35', {"ID": 35,
    "NAME": "categ 002",
    "DESCR": "simple description"});

    
    testGET('manuf', '41', { "ID": 41,
    "NAME": "company 002",
    "DESCR": "simple description",
    "LOGO_URL": "dummyURL.com"});


    testGET('cart', '419', {"ID": 419,
    "CLIENT_ID": 68,
    "CREATE_DATE": "2020-07-15T15:26:00.000Z",
    "CART_STATUS_ID": 2});

    
    testGET('cart_content', '374', {"ID": 374,
    "QUANTITY": 1,
    "PRODUCT_ID": 44,
    "CART_ID": 380});

    testGET('cart_history', '19', {
        "ID": 19,
        "CART_STATUS_ID": 3,
        "CLIENT_ID": 49,
        "CREATE_DATE": "2020-07-10T10:38:12.878Z"
    });


    testGET('cart_content_history', '13', {
        "ID": 13,
        "PRODUCT_ID": 46,
        "CART_HISTORY_ID": 19,
        "QUANTITY": 1,
        "OLD_PRICE": 11,
        "OLD_PRODUCT_NAME": "product 011"
    });


    testGET('cart_status', '1', {
        "ID": 1,
        "NAME": "open"
    });


    testGET('pr_image', '3', {
        "ID": 3,
        "URL": "imageURL.com",
        "PRODUCT_ID": 36
    });

    testGET('review', '9', {
        "ID": 9,
        "PRODUCT_ID": 36,
        "CLIENT_ID": 49,
        "RATING": 4,
        "TITLE": "some title",
        "TEXT": "some text"
    });

    testGET('ord', '14', {
        "ID": 14,
        "CREATE_DATE": "2020-07-10T11:10:42.329Z",
        "BILL": 11,
        "ADDRESS_ID": 13,
        "ORD_STATUS_ID": 3,
        "CART_HISTORY_ID": 19,
        "CLIENT_ID": 49
    });

    testGET('ord_item', '16', {
        "ID": 16,
        "CART_CONTENT_HISTORY_ID": 13,
        "ORD_ID": 14
    });

    testGET('order_status', '1', {
        "ID": 1,
        "NAME": "waiting for confirmation"
    });













});


describe('POST requests: ', function() {

    describe('POST /client', function() {
        it('POST new client', function(done) {
            request(app)
                .post('/api/client')
                .send({first_name: 'testName',
                    second_name: 'testSurname',
                    email: 'testEmail',
                    phone_num: '1337',
                    birth_date: '1999/12/02',
                    login: 'testLogin',
                    pass: 'testPass'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .expect({
                    "first_name": "testName",
                    "second_name": "testSurname",
                    "email": "testEmail",
                    "phone_num": "1337",
                    "birth_date": "1999/12/02",
                    "login": "testLogin",
                    "pass": "testPass"
                })
                .end(function(err, res) {
                    if (err){
                        // console.log(res);
                        return done(err);
                    }
                    
                    
                    done();
                });
        });

        // it('GET request to check validity', function(done) {

        // });

    });







});





