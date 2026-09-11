# beta.104 acceptance criteria

Beta.104 is accepted when a valid completed Boss Session can be claimed once, produces only a canonical server reward, and commits inventory + receipt + consumed session atomically. Replaying the same claim must not duplicate inventory. Invalid, expired, incomplete, foreign-account or conflicting claims must fail closed. All existing launch and multiplayer regressions must remain green.
