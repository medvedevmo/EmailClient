const { app, BrowserWindow, ipcMain } = require('electron');
const JSONLoader = require('./JSONLoader.js');
const path = require('path');


function createWindow () {
  const win = new BrowserWindow({
    width: 1126,
    height: 800,
    center: true,
    frame: false,
    icon: 'icon.png',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    }
  });

  var settings = JSONLoader.readJSON('config/settings.json');
  if (settings.isLanguageChoosen == false) {
    ipcMain.on('change-language', (event, lang) => {
      var languageToChange = lang;
      console.log(`Changing language to ${languageToChange}.`);
      async function changeLanguage() {
        await JSONLoader.changeJSON('./config/settings.json', "language", languageToChange);
        await JSONLoader.changeJSON('./config/settings.json', "isLanguageChoosen", 'true');
    }
    changeLanguage()    
    });
    win.loadFile('language.html');
  }
  else if (settings.isLoggedIn == false) {
    win.loadFile('authorize.html');
  }
  else {
    win.loadFile('index.html');
  }
}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
