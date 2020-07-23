var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var sinon = require('sinon');

// var router = require('../services/router.js');

const request = require('supertest');


const app = 'http://192.168.99.100:3000';


it('a single test case', function(done){
    assert('a' == 'a', 'ok');
    done();
});