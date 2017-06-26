/**
 * @fileOverview End-to-End test helpers.
 */

const {Application} = require('spectron');
const path = require('path');
const chaiAsPromised = require('chai-as-promised');

const root = path.resolve(__dirname, '..', '..');

/**
 * Start the application and wait until the main window is loaded.
 * @return {Promise.<spectron.Application>}
 */
function startApp() {
  const app = new Application({
    path: path.join(root, 'node_modules', '.bin', 'electron'),
    args: [
      path.join(root, 'app', 'main')
    ],
    waitTimeout: 10000
  });

  return app.start()
    .then((app) => {
      chaiAsPromised.transferPromiseness = app.transferPromiseness;
      return app.client.waitUntilWindowLoaded();
    })
    .then(() => app);
}

module.exports = {
  startApp
};
