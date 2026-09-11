# beta.104 production wiring handoff

Wire `server/boss_settlement.js` using the same pool already owned by the trade inventory store. Pass the settlement service to acquisition HTTP. The HTTP route should authenticate, parse `{sessionId}`, call settlement once, and serialize its result. It should not separately read Boss Session proof, call `store.grant`, or call `consumeCompleted` after wiring.
