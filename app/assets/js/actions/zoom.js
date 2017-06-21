//noinspection NpmUsedModulesInstalled
const {ipcRenderer, webFrame, remote} = require('electron');

const {Menu} = remote;
const maximumZoomLevel = 3;

let currentZoomLevel, zoomMenuItems;

function getZoomUI() {
  const menu = Menu.getApplicationMenu();
  const menuItems = [];
  menu.items.forEach(item => {
    if (item.id === 'view') {
      item.submenu.items.forEach(item => {
        if (item.id && item.id.match(/^zoom-.*/)) {
          menuItems.push(item);
        }
      });
    }
  });
  return menuItems;
}

function enableZoomUI() {
  zoomMenuItems.forEach(item => {
    item.enabled = true;
  });
}

function disableZoomUI() {
  zoomMenuItems.forEach(item => {
    item.enabled = false;
  });
}

window.addEventListener('blur', () => {
  disableZoomUI();
});

window.addEventListener('focus', () => {
  enableZoomUI();
});

window.addEventListener('load', () => {
  currentZoomLevel = webFrame.getZoomLevel();
  zoomMenuItems = getZoomUI();
  enableZoomUI();
});

ipcRenderer.on('zoom-actual', event => {
  currentZoomLevel = webFrame.setZoomLevel(0);
});

ipcRenderer.on('zoom-in', event => {
  if (currentZoomLevel < maximumZoomLevel) {
    currentZoomLevel = webFrame.setZoomLevel(currentZoomLevel + 1);
  }
});

ipcRenderer.on('zoom-out', event => {
  if (currentZoomLevel > 0) {
    currentZoomLevel = webFrame.setZoomLevel(currentZoomLevel - 1);
  }
});
