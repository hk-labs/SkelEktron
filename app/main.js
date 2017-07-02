//noinspection NpmUsedModulesInstalled
const {app, dialog, ipcMain, BrowserWindow, Menu} = require('electron');
const path = require('path');
const _ = require('lodash');
const {createWindow} = require('./lib/window');
const {build: {appId, productName}} = require('../package.json');

// Catch unhandled errors and promise rejections
require('./lib/error-handler');

// Use system log facility, should work on Windows too
require('./lib/log')(appId || 'electron-boilerplate');

// Load app configuration file
const config = require('./config');
global.appSettings = config;

const isDev = require('electron-is-dev');

if (isDev || config.debug) {
  console.debug('Running in development');
} else {
  console.debug('Running in production');
}

console.debug('config:', config);

// Adds debug features like hotkeys for triggering dev tools and reload
// (disabled in production, unless the menu item is displayed)
require('electron-debug')({
  enabled: isDev || config.debug
});

// Prevent window being garbage collected
let mainWindow = null;

// Other windows we may need
let infoWindow = null;

app.setName(productName || 'Electron Boilerplate');

function initialize() {
  const shouldQuit = makeSingleInstance();
  if (shouldQuit) return app.quit();

  // Use printer utility lib (requires printer module, see README)
  // require('./lib/printer');

  app.on('activate', activate);

  app.on('ready', () => {
    Menu.setApplicationMenu(createMenu());
    activate();
    startAutoUpdate();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('will-quit', () => {});

  ipcMain.on('open-info-window', () => {
    if (infoWindow) {
      return;
    }

    infoWindow = new BrowserWindow({
      width: 300,
      height: 340,
      resizable: false
    });
    infoWindow.loadURL(`file://${__dirname}/info.html`);

    infoWindow.on('closed', () => {
      infoWindow = null;
    });
  });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createMenu() {
  return Menu.buildFromTemplate(require('./lib/menu'));
}

/**
 * Activate the main window.
 */
function activate() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = createWindow(config.mainWindow)
    .on('closed', () => {
      mainWindow = null;
    });
}

/**
 * Manage automatic updates.
 */
function startAutoUpdate() {
  try {
    require('./lib/auto-update/update')({
      url: config.update.url || false,
      version: app.getVersion()
    });

    ipcMain.on('update-downloaded', autoUpdater => {
      // Elegant solution: display unobtrusive notification messages
      mainWindow && mainWindow.webContents.send('update-downloaded');
      ipcMain.on('update-and-restart', () => {
        autoUpdater.quitAndInstall();
      });

      // Basic solution: display a message box to the user
      // var updateNow = dialog.showMessageBox(mainWindow, {
      //   type: 'question',
      //   buttons: ['Yes', 'No'],
      //   defaultId: 0,
      //   cancelId: 1,
      //   title: 'Update available',
      //   message: 'There is an update available, do you want to restart and install it now?'
      // })
      //
      // if (updateNow === 0) {
      //   autoUpdater.quitAndInstall()
      // }
    });
  }
  catch (e) {
    console.error(e.message);
    dialog.showErrorBox('Update Error', e.message);
  }
}

// Manage Squirrel startup event (Windows)
require('./lib/auto-update/startup')(initialize);
