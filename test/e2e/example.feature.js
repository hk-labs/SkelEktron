const {startApp} = require('./e2e-test-helpers');

describe('(e2e/spectron) example feature', function () {
  this.timeout(30000);

  let app;

  before('start the application', () => {
    return startApp()
      .then(_app => app = _app);
  });

  after('gracefully stop the application', () => {
    return app && app.isRunning() && app.stop();
  });

  it('opens a window displaying the main screen', () => {
    const window = app.client.browserWindow;

    return Promise.resolve()
      .then(() => expect(window.isMinimized()).to.eventually.be.false)
      .then(() => expect(window.isDevToolsOpened()).to.eventually.be.false)
      .then(() => expect(window.isVisible()).to.eventually.be.true)
      .then(() => expect(window.isFocused()).to.eventually.be.true)
      .then(() => expect(window.getBounds()).to.eventually.have.property('width').and.be.above(0))
      .then(() => expect(window.getBounds()).to.eventually.have.property('height').and.be.above(0))
      .then(() => expect(window.isVisible('.main')).to.eventually.be.true);
  });
});
