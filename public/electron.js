const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

electron.Menu.setApplicationMenu(new electron.Menu())

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680});
  mainWindow.loadURL('https://www.periphern.com/');
  mainWindow.on('closed', () => mainWindow = null);
}

const template = [
  {
    label: 'Account',
    submenu: [
      {
        label: 'Dashboard',
        click() {
          window.location = "/dashboard"
        }
      },
      {
        label: 'Log out',
        click() {
          window.localStorage.clear()
          window.location = "/login"
        }
      },
      {
        label: 'Login',
        click() {
          window.location = "/login"
        }
      },
      {
        label: 'Sign up',
        click() {
          window.location = "/sign-up"
        }
      },
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize',
      },
      {
        role: 'close'
      }
    ]
  },
]
const menu = electron.Menu.buildFromTemplate(template)
electron.Menu.setApplicationMenu(menu)
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

