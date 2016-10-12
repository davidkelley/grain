/**
 * Sets chai libraries as globals so we don't have to require them in tests.
 * @file
 */

import chai from 'chai';

// Make sure we're in test env
process.env.NODE_ENV = 'test';

// Assign globals, so we don't have to require them in test files.
global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;
