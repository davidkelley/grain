'use strict';
// tests for related
// Generated by serverless-mocha-plugin

process.env.NODE_ENV = 'test';

const mod               = require('../handler.js');
const mochaPlugin       = require('serverless-mocha-plugin');
const lambdaWrapper     = mochaPlugin.lambdaWrapper;
const expect            = mochaPlugin.chai.expect;

const liveFunction = {
  region: process.env.SERVERLESS_REGION,
  lambdaFunction: process.env.SERVERLESS_PROJECT + '-GetInstruments'
};

const wrapped = lambdaWrapper.wrap(mod, { handler: 'GetInstruments' });

describe('related', () => {

  before(function (done) {
    lambdaWrapper.init(liveFunction);
    done();
  });

  it('should respond with 200 code', (done) => {
    wrapped.run({ query: { b: 1 }, body: { a: "foobar" } }, (err, response) => {
      expect(response.statusCode).to.eql(200);
      done();
    });
  });
});