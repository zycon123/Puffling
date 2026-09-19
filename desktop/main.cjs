const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

const GAME_ENTRY = path.join(__dirname, '..', 'index.html');
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Orbuff',
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#11131a',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowed = new URL(mainWindow.webContents.getURL() || 'file:///').protocol === 'file:' && /^file:/i.test(url);
    if (!allowed) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;

    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
      return;
    }

    if (input.key === 'Escape' && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
      event.preventDefault();
    }
  });

  mainWindow.loadFile(GAME_ENTRY);
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.zyconstudios.orbuff');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
