var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

const request = require('supertest');
const bodyParser = require('body-parser');

const app = 'http://192.168.99.100:3000';


/*  FUNCTIONS (FOR LESS DUPLICATION):   */

function isNumeric(n) {
    if(!isNaN(parseFloat(n)) && isFinite(n)){
        return parseInt(n, 10);
    } else if(!isNaN(Date.parse(n))) {
        if(n.length == 10) return n.concat('T00:00:00.000Z').replaceAll('/', '-');
        else return n.concat('.000Z').replace(' ', 'T').replaceAll('/', '-');
    }
    else return n;
  
}

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

function testPOST(url, data) {
    describe('POST /'.concat(url), function() {
        it('POST new '.concat(url), function(done) {
            request(app)
                .post('/api/'.concat(url))
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .expect(data)
                .end(function(err, res) {
                    if (err){
                        // console.log(res);
                        return done(err);
                    }
                    
                    
                    done();
                });
        });

        /* ----------  */

        var getID;
        var newURL;
        if(url == 'manuf'){
            newURL = 'MANUFACTURER';
        }
        else if(url == 'pr_image'){
            newURL = 'PRODUCT_IMAGE';
        }
        else newURL = url.toUpperCase();
        const modifiedData = {};

        request(app)
        .get('/api/sequence/SEQ_'.concat(newURL))
        .then(function(response){
            getID = response.body.LAST_NUMBER;
        });
        

        it('GET request to check validity', function(done) {
            request(app)
                .get('/api/'.concat(url, '/', getID))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });
}

function testPOSTord() {

    let cartID;
    let clientID;

    request(app)
        .get('/api/cart')
        .then(function(response){
            cartID = response.body[0]['ID'];
            clientID = response.body[0]['CLIENT_ID'];
        });

    describe('POST /ord', function() {
        it('POST new ord', function(done) {
            request(app)
                .post('/api/ord')
                .send({
                    client_id: clientID,
                    cart_id: cartID, 
                    create_date: '2020/07/17 20:20:20',
                    country: 'testCountry',
                    state: 'testState',
                    city: 'testCity',
                    street: 'testStreet',
                    house: '47',
                    zip: 'A15P5E1',
                    ord_status_id: '1'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .expect({
                    client_id: clientID,
                    cart_id: cartID, 
                    create_date: '2020/07/17 20:20:20',
                    country: 'testCountry',
                    state: 'testState',
                    city: 'testCity',
                    street: 'testStreet',
                    house: '47',
                    zip: 'A15P5E1',
                    ord_status_id: '1'
                })
                .end(function(err, res) {
                    if (err){
                        // console.log(res);
                        return done(err);
                    }
                    
                    
                    done();
                });
        });

        
        var getID;

        request(app)
        .get('/api/sequence/SEQ_ORD')
        .then(function(response){
            getID = response.body.LAST_NUMBER;
        });
        

        it('GET request to check validity', function(done) {
            request(app)
                .get('/api/ord/'.concat(getID))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });



    });

}

function testPUT(url, id, data) {
    describe('PUT /'.concat(url), function() {
        it('Updating '.concat(url, ' at id = ', id), function(done) {
            request(app)
                .put('/api/'.concat(url,'/', id))
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(Object.assign({}, data, {id: parseInt(id, 10)}))
                .end(function(err, res) {
                    if (err){
                        // console.log(res);
                        return done(err);
                    }
                    
                    done();
                });
        });
    });


}


/*    TEST CASES:       */ 

describe('GET requests: ', function() {

    testGET('client', '1', {
        "ID": 1,
        "FIRST_NAME": "name 001",
        "SECOND_NAME": "surname 001",
        "LOGIN": "user 001",
        "PASS": "simplepass",
        "EMAIL": "email 001",
        "PHONE_NUM": 1,
        "BIRTH_DATE": "1999-12-02T00:00:00.000Z"
    });

    testGET('product', '4', {
        "ID": 4,
        "NAME": "product 004",
        "PRICE": 4,
        "DESCR": "simple description",
        "SPEC": "simple specs",
        "STOCK_NUM": 187,
        "URL": "dummyProductURL.com",
        "CATEG_ID": 4,
        "RATING": 2,
        "MANUFACTURER_ID": 4,
        "IS_ACTIVE": 1
    });

    testGET('categ', '1', {
        "ID": 1,
        "NAME": "categ 001",
        "DESCR": "simple description"
    });

    
    testGET('manuf', '1', {
        "ID": 1,
        "NAME": "company 001",
        "DESCR": "simple description",
        "LOGO_URL": "dummyURL.com"
    });


    testGET('cart', '406', {
        "ID": 406,
        "CLIENT_ID": 16,
        "CREATE_DATE": "2020-07-20T03:57:56.031Z",
        "CART_STATUS_ID": 1
    });

    
    testGET('cart_content', '350', {
        "ID": 350,
        "QUANTITY": 1,
        "PRODUCT_ID": 5,
        "CART_ID": 382
    });

    testGET('cart_history', '33', {
        "ID": 33,
        "CART_STATUS_ID": 3,
        "CLIENT_ID": 3,
        "CREATE_DATE": "2020-07-20T03:54:48.040Z"
    });


    testGET('cart_content_history', '1', {
        "ID": 1,
        "PRODUCT_ID": 15,
        "CART_HISTORY_ID": 33,
        "QUANTITY": 1,
        "OLD_PRICE": 15,
        "OLD_PRODUCT_NAME": "product 015"
    });


    testGET('cart_status', '1', {
        "ID": 1,
        "NAME": "open"
    });


    testGET('pr_image', '1', {
        "ID": 1,
        "URL": "URLURLURL",
        "PRODUCT_ID": 1
    });

    testGET('review', '1', {
        "ID": 1,
        "PRODUCT_ID": 1,
        "CLIENT_ID": 1,
        "RATING": 5,
        "TITLE": "some title",
        "TEXT": "some text"
    });

    testGET('ord', '1', {
        "ID": 1,
        "CREATE_DATE": "2020-07-20T04:03:46.740Z",
        "BILL": 15,
        "ADDRESS_ID": 1,
        "ORD_STATUS_ID": 3,
        "CART_HISTORY_ID": 33,
        "CLIENT_ID": 3
    });

    testGET('ord_item', '1', {
        "ID": 1,
        "CART_CONTENT_HISTORY_ID": 1,
        "ORD_ID": 1
    });

    testGET('order_status', '1', {
        "ID": 1,
        "NAME": "waiting for confirmation"
    });

    testGET('address', '1', {
        "ID": 1,
        "COUNTRY": "KZ",
        "PROVINCE_STATE": "Alm Obl",
        "CITY": "Alm",
        "STREET": "Satpayeva",
        "HOUSE_NO": "47",
        "ZIP": "A15P5E1"
    });











});


describe('POST requests: ', function() {

    testPOST('client', {
    first_name: 'testName',
    second_name: 'testSurname',
    email: 'testEmail',
    phone_num: '1337',
    birth_date: '1999/12/02',
    login: 'testLogin',
    pass: 'testPass'
    });

    testPOST('categ', {
        name: "testCateg",
        descr: "testDescr"
    });

    testPOST('manuf', {
        name: "testCateg",
        descr: "testDescr",
        logo_url: "testUrl"
    });

    testPOST('product', {
        name: "testProduct",
        price: "1337",
        descr: "testDescr",
        spec: "testSpec",
        stock_num: "228",
        url: "testUrl",
        categ_id: "1",
        manufacturer_id: "1",
        rating: "0",
        is_active: "1"
    });

    testPOST('cart', {
        client_id: "1",
        create_date: "2020/07/17 22:55:00",
        cart_status_id: "1"
    });

    testPOST('cart_content', {
        quantity: "1",
        product_id: "1",
        cart_id: "430"
    });

    testPOST('cart_status', {
        name: "testStatus"
    });

    
    // Separate testPOST for ord is needed
    testPOSTord();

    testPOST('order_status', {
        name: "testStatus"
    });

    testPOST('pr_image', {
        url: "testURL",
        product_id: "1"
    });

    testPOST('review', {
        product_id: "1",
        client_id: "1",
        rating: "4",
        title: "testTitle",
        text: "testText"
    });




});

describe('PUT requests: ', function() {
    
    testPUT('client', '146', {
        first_name: "edited1",
        second_name: "edited2",
        email: "edited3",
        phone_num: 228,
        birth_date: "1999/12/02",
        login: "edited4",
        pass: "edited5"
    });

    

});



