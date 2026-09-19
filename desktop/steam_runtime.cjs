const fs = require('node:fs');
const path = require('node:path');

const ACHIEVEMENTS = Object.freeze({
  achSkyLegend: 'ORB_SKY_LEGEND',
  achCloudBreaker: 'ORB_CLOUD_BREAKER',
  achSkyImmortal: 'ORB_SKY_IMMORTAL',
  achEventMaster: 'ORB_EVENT_MASTER',
  achBossHunter: 'ORB_BOSS_HUNTER',
  achBossVeteran: 'ORB_BOSS_VETERAN',
  achTreasureHunter: 'ORB_TREASURE_HUNTER'
});

function readPositiveInt(value) {
  const n = Number.parseInt(String(value || '').trim(), 10);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

function discoverAppId(app) {
  const envId = readPositiveInt(process.env.ORBUFF_STEAM_APP_ID);
  if (envId) return { appId: envId, source: 'env' };

  const candidates = [
    path.join(process.cwd(), 'steam_appid.txt'),
    path.join(path.dirname(app.getPath('exe')), 'steam_appid.txt'),
    path.join(app.getAppPath(), 'steam_appid.txt')
  ];

  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const appId = readPositiveInt(fs.readFileSync(file, 'utf8'));
      if (appId) return { appId, source: file };
    } catch (_) {}
  }

  return { appId: 0, source: 'none' };
}

function safeJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function createSteamRuntime({ app }) {
  const cloudDir = path.join(app.getPath('userData'), 'steam-cloud');
  const cloudFile = path.join(cloudDir, 'orbuff-save.json');
  const discovered = discoverAppId(app);

  let steamworks = null;
  let client = null;
  let initError = '';
  let callbacksTimer = null;

  function tryInit() {
    if (!discovered.appId) {
      initError = 'steam_app_id_missing';
      return;
    }

    try {
      steamworks = require('steamworks.js');
    } catch (error) {
      initError = 'steamworks_module_missing';
      return;
    }

    try {
      client = steamworks.init(discovered.appId);
      if (typeof steamworks.electronEnableSteamOverlay === 'function') {
        try { steamworks.electronEnableSteamOverlay(); } catch (_) {}
      }
      if (typeof steamworks.runCallbacks === 'function') {
        callbacksTimer = setInterval(() => {
          try { steamworks.runCallbacks(); } catch (_) {}
        }, 500);
        callbacksTimer.unref?.();
      }
      initError = '';
    } catch (error) {
      initError = String(error?.message || error || 'steam_init_failed');
      client = null;
    }
  }

  function status() {
    let user = '';
    let steamId = '';
    let deck = false;
    let buildId = 0;

    if (client) {
      try { user = String(client.localplayer?.getName?.() || ''); } catch (_) {}
      try { steamId = String(client.localplayer?.getSteamId?.()?.steamId64 || ''); } catch (_) {}
      try { deck = !!client.utils?.isSteamRunningOnSteamDeck?.(); } catch (_) {}
      try { buildId = Number(client.apps?.appBuildId?.() || 0); } catch (_) {}
    }

    return {
      active: !!client,
      configured: discovered.appId > 0,
      appId: discovered.appId || null,
      appIdSource: discovered.source,
      user,
      steamId,
      steamDeck: deck,
      buildId,
      cloudFile,
      error: initError
    };
  }

  function unlockAchievement(id) {
    const apiName = ACHIEVEMENTS[String(id || '')] || String(id || '');
    if (!client || !apiName) return { ok: false, reason: 'steam_inactive' };
    try {
      const already = !!client.achievement?.isActivated?.(apiName);
      if (already) return { ok: true, already: true, achievement: apiName };
      const ok = !!client.achievement?.activate?.(apiName);
      return { ok, already: false, achievement: apiName, reason: ok ? '' : 'steam_rejected' };
    } catch (error) {
      return { ok: false, achievement: apiName, reason: String(error?.message || error) };
    }
  }

  function setStat(name, value) {
    if (!client) return { ok: false, reason: 'steam_inactive' };
    const key = String(name || '').replace(/[^A-Z0-9_]/gi, '_').slice(0, 64);
    const intValue = Math.max(0, Math.min(2147483647, Math.floor(Number(value) || 0)));
    if (!key) return { ok: false, reason: 'invalid_stat' };
    try {
      const set = !!client.stats?.setInt?.(key, intValue);
      const stored = set ? !!client.stats?.store?.() : false;
      return { ok: set && stored, stat: key, value: intValue };
    } catch (error) {
      return { ok: false, stat: key, reason: String(error?.message || error) };
    }
  }

  function saveCloudSnapshot(snapshot) {
    try {
      fs.mkdirSync(cloudDir, { recursive: true });
      const payload = {
        schema: 1,
        savedAt: new Date().toISOString(),
        data: safeJson(snapshot || {})
      };
      const temp = cloudFile + '.tmp';
      fs.writeFileSync(temp, JSON.stringify(payload, null, 2), 'utf8');
      fs.renameSync(temp, cloudFile);
      return { ok: true, file: cloudFile, savedAt: payload.savedAt };
    } catch (error) {
      return { ok: false, reason: String(error?.message || error) };
    }
  }

  function loadCloudSnapshot() {
    try {
      if (!fs.existsSync(cloudFile)) return { ok: true, exists: false, data: null };
      const parsed = JSON.parse(fs.readFileSync(cloudFile, 'utf8'));
      if (!parsed || parsed.schema !== 1 || typeof parsed.data !== 'object') {
        return { ok: false, reason: 'invalid_cloud_snapshot' };
      }
      return { ok: true, exists: true, savedAt: String(parsed.savedAt || ''), data: safeJson(parsed.data) };
    } catch (error) {
      return { ok: false, reason: String(error?.message || error) };
    }
  }

  function openOverlay(section = 'achievements') {
    if (!client?.overlay?.activateDialog) return { ok: false, reason: 'steam_inactive' };
    const dialogs = { friends: 0, community: 1, players: 2, settings: 3, group: 4, stats: 5, achievements: 6 };
    const dialog = dialogs[String(section || '').toLowerCase()];
    if (!Number.isInteger(dialog)) return { ok: false, reason: 'unknown_overlay' };
    try {
      client.overlay.activateDialog(dialog);
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: String(error?.message || error) };
    }
  }

  function shutdown() {
    if (callbacksTimer) clearInterval(callbacksTimer);
    callbacksTimer = null;
  }

  tryInit();

  return {
    status,
    unlockAchievement,
    setStat,
    saveCloudSnapshot,
    loadCloudSnapshot,
    openOverlay,
    shutdown,
    achievements: ACHIEVEMENTS
  };
}

module.exports = { createSteamRuntime, ACHIEVEMENTS };
