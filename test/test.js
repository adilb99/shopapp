var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var sinon = require('sinon');

// var router = require('../services/router.js');

const request = require('supertest');


const app = 'http://192.168.99.100:3000';

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
    let ordID;
    let addrID;
    let cr_date;
    let bill;
    let ord_status_id;
    let client_id;
    let cart_date;
    let in_data;
    

    request(app)
        .get('/api/cart')
        .then(function(response){
            cartID = response.body[0]['ID'];
            cart_date = response.body[0]['CREATE_DATE'];
            in_data = {
                cart_id: cartID, 
                country: 'testCountry',
                province_state: 'testState',
                city: 'testCity',
                street: 'testStreet',
                house_no: '47',
                zip: 'A15P5E1'
            };
        });

    describe('POST /ord', function() {
        it('POST new ord', function(done) {

            request(app)
                .post('/api/ord')
                .send(in_data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function(err, res) {
                    if (err){
                        return done(err);
                    }

                    ordID = parseInt(res.body.id, 10);
                    addrID = parseInt(res.body.address_id, 10);
                    cr_date = res.body.create_date;
                    bill = parseInt(res.body.bill, 10);
                    ord_status_id = parseInt(res.body.ord_status_id, 10);
                    client_id = parseInt(res.body.client_id, 10);
                    done();
                });
        });

        

        it('GET ord', function(done) {
            request(app)
                .get('/api/ord/'.concat(ordID))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    "ID": ordID,
                    "CREATE_DATE": cr_date,
                    "BILL": bill,
                    "ADDRESS_ID": addrID,
                    "ORD_STATUS_ID": ord_status_id,
                    "CART_HISTORY_ID": cartID, 
                    "CLIENT_ID": client_id
                }, done);
        });


        it('GET address', function(done) {
            request(app)
                .get('/api/address/'.concat(addrID))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    "ID": addrID,
                    "COUNTRY": in_data.country,
                    "PROVINCE_STATE": in_data.province_state,
                    "CITY": in_data.city,
                    "STREET": in_data.street,
                    "HOUSE_NO": in_data.house_no,
                    "ZIP": in_data.zip
                }, done);
        });


        it('GET to check if cart was deleted', function(done){
            request(app)
                .get('/api/cart/'.concat(cartID))
                .expect(404, done);

        });

        it('GET to check if cart was moved to history', function(done){
            request(app)
                .get('/api/cart_history/'.concat(cartID))
                .expect(200)
                .expect({
                   "ID": cartID,
                   "CART_STATUS_ID": 3,
                   "CLIENT_ID": client_id,
                   "CREATE_DATE": cart_date
                }, done);
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

describe.skip('Black-Box request testing: ', function() {


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

        testGET('product', '1', {
            "ID": 1,
            "NAME": "product 001",
            "PRICE": 1,
            "DESCR": "simple description",
            "SPEC": "simple specs",
            "STOCK_NUM": 176,
            "URL": "dummyProductURL.com",
            "CATEG_ID": 1,
            "RATING": 4.5,
            "MANUFACTURER_ID": 1,
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


        testGET('cart', '370', {
            "ID": 370,
            "CLIENT_ID": 10,
            "CREATE_DATE": "2020-07-22T08:44:30.198Z",
            "CART_STATUS_ID": 1
        });

        
        testGET('cart_content', '370', {
            "ID": 370,
            "QUANTITY": 1,
            "PRODUCT_ID": 8,
            "CART_ID": 370
        });

        testGET('cart_history', '1', {
            "ID": 1,
            "CART_STATUS_ID": 3,
            "CLIENT_ID": 1,
            "CREATE_DATE": "2020-07-22T08:44:29.905Z"
        });


        testGET('cart_content_history', '1', {
            "ID": 1,
            "PRODUCT_ID": 16,
            "CART_HISTORY_ID": 1,
            "QUANTITY": 1,
            "OLD_PRICE": 16,
            "OLD_PRODUCT_NAME": "product 016"
        });


        testGET('cart_status', '1', {
            "ID": 1,
            "NAME": "open"
        });


        testGET('pr_image', '1', {
            "ID": 1,
            "URL": "testURL",
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
            "CREATE_DATE": "2020-07-22T08:44:30.591Z",
            "BILL": 16,
            "ADDRESS_ID": 1,
            "ORD_STATUS_ID": 3,
            "CART_HISTORY_ID": 1,
            "CLIENT_ID": 1
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
            cart_id: "380"
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


});


describe('User Scenario 1 (Valid)', function() {
    
    let clientID;
    let cartID;

    describe('Register User', function(){
        
        let getID;
        var new_date;

        const logeen = 'randomLogin'.concat(Math.floor(Math.random() * 101));

        const data = {
            first_name: 'Adil',
            second_name: 'Botabekov',
            login: logeen,
            pass: 'simplepass',
            email: 'adilb99@kaist.ac.kr',
            phone_num: 9999,
            birth_date: '1999/12/02'
        };

        const put_data = {
            first_name: 'editedName',
            second_name: 'editedSurname',
            login: 'editedLogin123123',
            pass: 'editedPass',
            email: 'adilb99@kaist.ac.kr',
            phone_num: 9991,
            birth_date: '1988/11/03'
        };
        
        it('(POST new client)', function(done){
            request(app)
                    .post('/api/client')
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end(function(err, res) {
                        if (err){
                            return done(err);
                        }
                        getID = res.body.id;
                        new_date = res.body.birth_date;
                        clientID = getID;
                        done();
                    });

        });


        it('GET client to check', function(done){
            request(app)
                .get('/api/client/'.concat(getID))
                .expect(200)
                .expect({
                    "ID": getID,
                    "FIRST_NAME": data.first_name,
                    "SECOND_NAME": data.second_name,
                    "EMAIL": data.email,
                    "LOGIN": logeen,
                    "PASS": data.pass,
                    "PHONE_NUM": data.phone_num,
                    "BIRTH_DATE": new_date
                }, done);
        });

        it('PUT req -> client', function(done){
            request(app)
                .put('/api/client/'.concat(getID))
                .send(put_data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function(err, res){
                    if(err){
                        done(err);
                    }
                    new_date = res.body.birth_date;
                    done();
                });
        });

        it('GET req to check PUT', function(done){
            request(app)
                .get('/api/client/'.concat(getID))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    "ID": getID,
                    "FIRST_NAME": put_data.first_name,
                    "SECOND_NAME": put_data.second_name,
                    "EMAIL": put_data.email,
                    "LOGIN": put_data.login,
                    "PASS": put_data.pass,
                    "PHONE_NUM": put_data.phone_num,
                    "BIRTH_DATE": new_date
                }, done);
        });

    });
    


    it('View all products', function(done){
        request(app)
                .get('/api/product')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });


    it('Select a single product', function(done){
        request(app)
                .get('/api/product/14')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
    });


    describe('Create cart', function(){
        
        let getID;
        
        it('Create cart (POST new cart)', function(done){
            request(app)
                    .post('/api/cart')
                    .send({
                        client_id: clientID,
                    })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end(function(err, res) {
                        if (err){
                            // console.log(res);
                            return done(err);
                        }

                        getID = res.body.id;
                        cartID = getID;
                        done();
                    });
        });

        
        it('GET request to check', function(done){
            request(app)
                .get('/api/cart/'.concat(getID))
                .expect(200, function(err, res){
                    if(err) {
                        done(err);
                    }


                    assert(res.body.ID == getID, 'id mismatch');
                    assert(res.body.CART_STATUS_ID == 1, 'status id mismatch');
                    assert(res.body.CLIENT_ID == clientID, 'client id mismatch');

                    done();
                });
        });


    });

    

    describe('Populate the cart', function(){

        let getID;

        it('Populate the cart with selected product (POST)', function(done){
            request(app)
                .post('/api/cart_content')
                .send({
                    quantity: 1,
                    product_id: 14,
                    cart_id: cartID
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function(err, res) {
                    if (err){
                        // console.log(res);
                        return done(err);
                    }

                    getID = res.body.id;

                    done();
                });
        });

        it('GET req to check', function(done){
            request(app)
                .get('/api/cart_content/'.concat(getID))
                .expect(200, function(err,res){
                    if(err){
                        done(err);
                    }

                    assert(res.body.ID == getID, 'id mismatch');
                    assert(res.body.CART_ID == cartID, 'cart id mismatch');
                    assert(res.body.PRODUCT_ID == 14, 'product id mismatch');
                    assert(res.body.QUANTITY == 1, 'quantity mismatch');
                    
                    done();

                });
        });

    });


    testPOSTord();

    // CHECK IF CART IS DELETED AND PUT INTO HISTORY

    describe('Deliver order', function(){

        it('(PUT order)', function(done){
            request(app)
                .put('/api/ord/304')
                .send({
                    ord_status_id: 3
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err){
                        // console.log(res);
                        return done(err);
                    }
                    done();
                });
        });

        it('GET request to check', function(done){
            request(app)
                .get('/api/ord/304')
                .expect(200, function(err, res){
                    if(err){
                        done(err);
                    }

                    assert(res.body.ORD_STATUS_ID == 3, 'status mismatch');
                    done();

                });
        });

    });
    

});


describe('User Scenario 2 (Invalid)', function() {
    

    it('create new user with invalid fields', function(done){
        request(app)
            .post('/api/client')
            .send({
                first_name: '',
                second_name: '',
                login: null,
                pass: 'simplepass',
                email: 12,
                phone_num: 'aaa',
                birth_date: '1999-12-02'
            })
            .expect(500, done);
    });

    it('login into non-existing account', function(done){
        request(app)
            .get('/api/client/1000')
            .expect(404, done);
    });


    it('Add product to cart with quantity larger than stock', function(done){
        request(app)
            .post('/api/cart_content')
            .send({
                product_id: 16,
                cart_id: 396,
                quantity: 3000000
            })
            .expect(500)
            .end(function(err, res) {
                if (err){
                    // console.log(res);
                    return done(err);
                }
                done();
            });
    });


    it('Partial input on new order', function(done){
        request(app)
            .post('/api/ord')
            .send({
                cart_id: 389, 
                country: 'KZ'
            })
            .expect(500, done)
    }); 
    
    it('sign-up with existing login', function(done){
        request(app)
            .post('/api/client')
            .send({
                first_name: 'name 001',
                second_name: 'surname 001',
                login: 'user 001',
                pass: 'simplepass',
                email: 'email 001',
                phone_num: 111,
                birth_date: '1999/12/02'
            })
            .expect(500, done);
    });

    it('DELETE request for ord (unsupported)', function(done){
        request(app)
            .delete('/api/ord/1')
            .expect(404, done);
    });

    
    it('UPDATE with wrong data', function(done){
        request(app)
            .put('/api/ord/9')
            .send({
                ord_status_id: 100 // no such status
            })
            .expect(500, done)
    });


});


describe('testing with stubs', function(){
    

    it('stubbed GET request', function(done){
        
        const mockResponse  = {
            code: 200,
            body: {
                id: 1,
                name: 'open'
            }
        };

        const reqInstance = request(app);
        
        const stub = sinon.stub(reqInstance, 'get');

        stub.yields(null, mockResponse);

        reqInstance
            .get('/api/cart_status/1', function(err, res){
                
                const codeCheck = (199 < res.code < 300);

                assert(codeCheck, 'response code invalid');
                assert('open' == res.body.name, 'response body invalid');
                
                sinon.restore();

                done();
            });
    });


});


describe('Register User, Edit data and Delete user', function(){
        
    let getID;
    var new_date;

    const logeen = 'randomLogin'.concat(Math.floor(Math.random() * 101));

    const data = {
        first_name: 'Adil',
        second_name: 'Botabekov',
        login: logeen,
        pass: 'simplepass',
        email: 'adilb99@kaist.ac.kr',
        phone_num: 9999,
        birth_date: '1999/12/02'
    };

    const put_data = {
        first_name: 'editedName',
        second_name: 'editedSurname',
        login: 'editedLogin123123',
        pass: 'editedPass',
        email: 'adilb99@kaist.ac.kr',
        phone_num: 9991,
        birth_date: '1988/11/03'
    };
    
    it('(POST new client)', function(done){
        request(app)
                .post('/api/client')
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function(err, res) {
                    if (err){
                        return done(err);
                    }
                    getID = res.body.id;
                    new_date = res.body.birth_date;

                    done();
                });

    });


    it('GET client to check', function(done){
        request(app)
            .get('/api/client/'.concat(getID))
            .expect(200)
            .expect({
                "ID": getID,
                "FIRST_NAME": data.first_name,
                "SECOND_NAME": data.second_name,
                "EMAIL": data.email,
                "LOGIN": logeen,
                "PASS": data.pass,
                "PHONE_NUM": data.phone_num,
                "BIRTH_DATE": new_date
            }, done);
    });

    it('PUT req -> client', function(done){
        request(app)
            .put('/api/client/'.concat(getID))
            .send(put_data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, function(err, res){
                if(err){
                    done(err);
                }
                new_date = res.body.birth_date;
                done();
            });
    });

    it('GET req to check PUT', function(done){
        request(app)
            .get('/api/client/'.concat(getID))
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "ID": getID,
                "FIRST_NAME": put_data.first_name,
                "SECOND_NAME": put_data.second_name,
                "EMAIL": put_data.email,
                "LOGIN": put_data.login,
                "PASS": put_data.pass,
                "PHONE_NUM": put_data.phone_num,
                "BIRTH_DATE": new_date
            }, done);
    });


    describe('delete client', function(){
        it('DELETE request', function(done){
            request(app)
                .delete('/api/client/'.concat(getID))
                .expect(204, done);
        });


        it('GET /client to check', function(done){
            request(app)
                .get('/api/client/'.concat(getID))
                .expect(404, done);
        });


    });

});


