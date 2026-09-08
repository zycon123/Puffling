(function(){
const BUILD='20260908-beta4-hotfix-boss-toast-1';
const parts=['js/platform_compat.js','js/beta_config.js','js/dom_refs.js','js/localization_core.js','js/audio_core.js','js/endless_boss_core.js','js/boss_multiplayer.js','js/music_bridge.js','js/leaderboard_submit.js','js/leaderboard_language_ui.js','js/state_content.js','js/world_helpers.js','js/run_menu_shop_upgrades.js','js/anti_cheat.js','js/input_missions_boss_spawn.js','js/gameplay_update.js','js/start_guard.js','js/achievements.js','js/achievements_menu.js','js/endless_events.js','js/player_render_helpers.js','js/renderer_runtime.js','js/ai_diagnostics.js','js/beta_release_ui.js','js/diagnostics_support.js','js/smoke_check.js'];
let i=0;
function next(){if(i>=parts.length)return;const s=document.createElement('script');s.src=parts[i++]+'?v='+BUILD;s.onload=next;s.onerror=()=>console.error('Kunne ikke laste',s.src);document.body.appendChild(s);}next();
})();