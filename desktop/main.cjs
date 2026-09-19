const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('node:path');
const { createSteamRuntime } = require('./steam_runtime.cjs');

const GAME_ENTRY = path.join(__dirname, '..', 'index.html');
let mainWindow = null;
let steamRuntime = null;

function registerSteamIpc() {
  ipcMain.handle('orbuff:desktop:fullscreen', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    return mainWindow.isFullScreen();
  });
  ipcMain.handle('orbuff:steam:status', () => steamRuntime?.status?.() || { active:false, configured:false, error:'runtime_unavailable' });
  ipcMain.handle('orbuff:steam:achievement', (_event, payload) => steamRuntime?.unlockAchievement?.(payload?.id) || { ok:false, reason:'runtime_unavailable' });
  ipcMain.handle('orbuff:steam:stat', (_event, payload) => steamRuntime?.setStat?.(payload?.name, payload?.value) || { ok:false, reason:'runtime_unavailable' });
  ipcMain.handle('orbuff:steam:cloud:save', (_event, payload) => steamRuntime?.saveCloudSnapshot?.(payload) || { ok:false, reason:'runtime_unavailable' });
  ipcMain.handle('orbuff:steam:cloud:load', () => steamRuntime?.loadCloudSnapshot?.() || { ok:false, reason:'runtime_unavailable' });
  ipcMain.handle('orbuff:steam:overlay', (_event, payload) => steamRuntime?.openOverlay?.(payload?.section) || { ok:false, reason:'runtime_unavailable' });
}

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
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
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
    if (input.type !== 'keyDown' || input.isAutoRepeat) return;

    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
      return;
    }

    // Escape belongs to renderer menu navigation, including in fullscreen.
  });

  mainWindow.loadFile(GAME_ENTRY);
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.zyconstudios.orbuff');
  steamRuntime = createSteamRuntime({ app });
  registerSteamIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => steamRuntime?.shutdown?.());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
