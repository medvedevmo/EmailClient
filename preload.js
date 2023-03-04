const {contextBridge, ipcRenderer} = require('electron');
const JSONLoader = require('./JSONLoader.js');

contextBridge.exposeInMainWorld('languagesAPI', {
  internalization: (page) => {
    var settings = JSONLoader.readJSON('config/settings.json');
    var language = settings.language;
    return JSONLoader.readKeyJSON('config/languages.json', `${language}&${page}`);
  }
});

contextBridge.exposeInMainWorld('authorizeAPI', {
  saveLoginData: (email, password, smtpName, smtpPort, imapName, imapPort) => {
    async function mainAsync() {
    await JSONLoader.changeKeysJSON('config/settings.json', 'loginData&SMTPServer', smtpName);
    await JSONLoader.changeKeysJSON('config/settings.json', 'loginData&SMTPport', smtpPort);
    await JSONLoader.changeKeysJSON('config/settings.json', 'loginData&IMAPServer', imapName);
    await JSONLoader.changeKeysJSON('config/settings.json', 'loginData&IMAPport', imapPort);
    await JSONLoader.changeKeysJSON('config/settings.json', 'loginData&username', email);
    await JSONLoader.changeKeysJSON('config/settings.json', 'loginData&password', password);
    await JSONLoader.changeJSON('config/settings.json', "isLoggedIn", 'true');
    }
    mainAsync();
  }
});

contextBridge.exposeInMainWorld('languageAPI', {
  changeLanguage: (lang) => ipcRenderer.send('change-language', lang)
});

contextBridge.exposeInMainWorld('mainAPI', {
  getEmails: () => {
    let receivedEmails = [];
    const settings = JSONLoader.readJSON('config/settings.json');
    const data = settings['loginData'];
    const { ImapFlow } = require('imapflow');
    const client = new ImapFlow({
        host: data['IMAPServer'],
        port: Number(data['IMAPport']),
        secure: true,
        auth: {
            user: data['username'],
            pass: data['password']
        }
    });

  const main = async () => {
      await client.connect();

      let lock = await client.getMailboxLock('INBOX');
      try {
          for await (let message of client.fetch('1:*', { envelope: true })) {
              receivedEmails.push(`${message.envelope.subject}`);
          }
      } finally {
          lock.release();
      }

      await client.logout();
  };
  main().catch(err => console.error(err));
  document.getElementById('emails').innerHTML = receivedEmails[0];
  console.log(receivedEmails)
  }
});

// Main to Renderer
// ipcRenderer.on('windowBlur', function (evt, message) {
//   if (message['ChangeCSS'] == true) {
//     // If we want to send message to renderer.js
//     window.postMessage('ChangeCSS', '*');
//     // If we dont want to send message to renderer.js
//     // document.getElementById('titleBar').style.opacity = 0;
//     console.log('CSS Changed (or request to change css sent)');
//   }
//   else {
//     console.log('CSS is not changed')
//   }
// });