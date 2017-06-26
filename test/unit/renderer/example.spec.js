/**
 * @fileOverview
 * This test suite is running in the electron's renderer process.
 */

//const {someHelperFn} = require('./renderer-unit-test-helpers');

describe('(unit/renderer-process) example test suite', () => {
  // before each test case
  beforeEach('setup', (done) => {
    done();
  });

  // after each test case
  afterEach('teardown', (done) => {
    done();
  });

  describe('#method', () => {
    it('does something', (done) => {
      expect(true).to.be.ok;
      done();
    });

    // add another behaviour tests...
  });

  // add other method tests...
});
