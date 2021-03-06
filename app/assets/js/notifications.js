// Boilerplate code for notification management
//noinspection NpmUsedModulesInstalled
const {ipcRenderer} = require('electron');

// Display a notification message when a new version is ready for install
// Customize the code to match your HTML structure
ipcRenderer.on('update-downloaded', event => {
  const notice = document.createElement('div');
  notice.setAttribute('class', 'notice');
  notice.innerHTML =
    '<p>An updated application package will be installed on next restart, <a id="restart" href="#">click here to update now</a>.</p>';

  document.body.appendChild(notice);

  document.getElementById('restart')
    .addEventListener('click', e => {
      e.preventDefault();
      event.sender.send('update-and-restart');
    });
});
