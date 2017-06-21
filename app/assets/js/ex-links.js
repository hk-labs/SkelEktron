// Open all external links outside the app
// Credit: Electron API Demos app
//noinspection NpmUsedModulesInstalled
const {shell} = require('electron');

const links = document.querySelectorAll('a[href]');

Array.prototype.forEach.call(links, (link) => {
  const url = link.getAttribute('href');
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      shell.openExternal(url);
    });
  }
});
