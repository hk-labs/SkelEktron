/**
 * @fileOverview
 * This test suite is running in the electron's main process.
 */

//const {someHelperFn} = require('./main-unit-test-helpers');

describe('(unit/main-process) example test suite', () => {
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
