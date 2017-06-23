/**
 * @fileOverview app configuration structure.
 */

const path = require('path');
const {getEnvironmentVariable} = require('./utils');

const appRoot = path.dirname(__dirname);

module.exports = {
  appRoot, // app root dir

  debug: getEnvironmentVariable('DEBUG', 'bool', false),

  // main window settings
  mainWindow: {
    title: 'Electron App | HKLabs',
    fullscreen: getEnvironmentVariable('FULLSCREEN', 'bool', undefined),
    defaultWidth: getEnvironmentVariable('MAIN_WINDOW_WIDTH', 'int', 1024),
    defaultHeight: getEnvironmentVariable('MAIN_WINDOW_HEIGHT', 'int', 768),
    url: getEnvironmentVariable('MAIN_WINDOW_URL', 'string', `file://${appRoot}/index.html`)
  },

  // squirrel update server url
  update: {
    url: getEnvironmentVariable('UPDATE_SERVER_URL', 'string', false)
  }
};
