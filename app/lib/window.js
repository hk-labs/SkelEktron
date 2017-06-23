//noinspection NpmUsedModulesInstalled
const {app, BrowserWindow} = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');

/**
 * Create a window with all the default error handlers bound.
 * @param {object} configs – window configurations
 * @param {number} configs.defaultWidth – default window width
 * @param {number} configs.defaultHeight – default window height
 * @return {BrowserWindow} – electron's {BrowserWindow} instance
 */
function createWindow(configs) {
  const {defaultWidth, defaultHeight, fullscreen} = configs;

  // Load the previous window state with fallback to defaults
  const windowState = windowStateKeeper({
    defaultWidth,
    defaultHeight
  });

  const {width, height, x, y} = windowState;

  const win = new BrowserWindow({
    fullscreen,
    width,
    height,
    x,
    y,
    title: configs.title,
    icon: path.join(__dirname, '/app/assets/img/icon.png'),
    show: false, // Hide your application until your page has loaded
    webPreferences: {
      // Disabling node integration allows to use libraries such as jQuery/React, etc
      nodeIntegration: ('nodeIntegration' in configs) ? configs.nodeIntegration : true,
      preload: path.resolve(path.join(__dirname, '..', 'preload.js'))
    }
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  windowState.manage(win);

  win.loadURL(configs.url, {});

  // Then, when everything is loaded, show the window and focus it so it pops up for the user
  // Yon can also use: win.webContents.on('did-finish-load')
  win.on('ready-to-show', () => {
    win.show();
    win.focus();
  });

  win.on('unresponsive', () => {
    // In the real world you should display a box and do something
    console.warn('The windows is not responding');
  });

  win.webContents.on('did-fail-load', (error, errorCode, errorDescription) => {
    let errorMessage;

    if (errorCode === -105) {
      errorMessage =
        errorDescription ||
        '[Connection Error] The host name could not be resolved, check your network connection';
      console.error(errorMessage);
    } else {
      errorMessage = errorDescription || 'Unknown error';
    }

    error.sender.loadURL(`file://${__dirname}/error.html`);
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('app-error', errorMessage);
    });
  });

  win.webContents.on('crashed', () => {
    // In the real world you should display a box and do something
    console.error('The browser window has just crashed');
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('hello');
  });

  return win;
}

module.exports = {
  createWindow
};
