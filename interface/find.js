const { remote } = require('electron');
const { FindInPage } = require('electron-find');

let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  preload: true,
  offsetTop: 6,
  offsetRight: 10
});

ipcRenderer.on('on-find', (e, args) => {
  findInPage.openFindWindow();
});