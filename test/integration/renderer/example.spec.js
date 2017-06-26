/**
 * @fileOverview
 * This test suite is running in the electron's renderer process,
 * so you don't need to mock those libraries out and can actually
 * write tests to integrate with them.
 */

//const {someHelperFn} = require('./renderer-test-helpers');

describe('(integration/renderer-process) example suite', () => {
  // before the whole suite
  before((done) => {
    // Be careful! The state of objects that you create in `before` statement
    // is shared between the suite's test cases. It's a good practice
    // to keep your test cases isolated so that they don't affect each other.
    // Consider to use the `beforeEach` statement for creating a new objects
    // for each test case individually.
    done();
  });

  // at the end of the suite
  after((done) => {
    done();
  });

  // before each test case
  beforeEach('setup', (done) => {
    done();
  });

  // after each test case
  afterEach('teardown', (done) => {
    done();
  });

  describe('feature 1', () => {
    it('should pass', (done) => {
      expect(true).to.be.ok;
      done();
    });

    // add other tests...
  });

  // add other features...
});
