const { contextBridge, ipcRenderer } = require('electron');

const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

contextBridge.exposeInMainWorld('OrbuffSteam', Object.freeze({
  status: () => invoke('orbuff:steam:status'),
  unlockAchievement: (id) => invoke('orbuff:steam:achievement', { id: String(id || '') }),
  setStat: (name, value) => invoke('orbuff:steam:stat', { name: String(name || ''), value: Number(value) || 0 }),
  saveCloudSnapshot: (data) => invoke('orbuff:steam:cloud:save', data),
  loadCloudSnapshot: () => invoke('orbuff:steam:cloud:load'),
  openOverlay: (section) => invoke('orbuff:steam:overlay', { section: String(section || 'achievements') })
}));

contextBridge.exposeInMainWorld('OrbuffDesktop', {toggleFullscreen: () => ipcRenderer.invoke('orbuff:desktop:fullscreen')});
