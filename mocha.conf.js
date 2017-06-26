process.env.NODE_ENV = 'test';

// Load Chai assertions
const chai = require('chai');
global.expect = chai.expect;

// Load Sinon
global.sinon = require('sinon');

// Initialize Chai plugins
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
