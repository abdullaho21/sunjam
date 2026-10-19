# Current state — 19 October 2026

The bank now has 51 categories × 18 entries = 918 (864 text + 54 listening). Every category gained 12 entries and has six questions at each tier. Reviewed giveaways were replaced, including Sciel’s Sun/Moon clue. Existing seed IDs stay stable; new text rows live in question-expansion.mjs. There are 166 illustrated answers, including all listening rounds.

Listening rounds now use an opaque black curtain over an on-demand YouTube IFrame player. Titles/artwork appear on reveal. Host-only troubleshooting can uncover it explicitly. Timers use video time, cleanup cancels late API loads, and answer time remains manual. No songs or lyrics are downloaded/rehosted.

Question history uses an anonymous cookie ID and localStorage flags. Draws prefer unencountered, unfinished questions in the chosen tier. Finished questions wait for whole-category exhaustion before a new cycle. A depleted tier waits for the rest. Abandoning an unrevealed question restores its helpers and permits a fresh draw; revealed questions remain attached to scoring and undo. History works across matches/reloads and falls back to memory when storage is blocked.

Validation: 33 checks via node scripts/test.mjs, all module syntax checks and the 15-file static build. Browser QA covered actual abandoned-question switching, persisted 1/18 completion after reload, a live black listening screen, 15-second completion, iframe cleanup and a loaded reveal thumbnail. See README for exact behavior and practical source/storage limits.

GitHub: same branch codex/deeper-trivia-audio and PR https://github.com/abdullaho21/sunjam/pull/1. This task is authorized to upload changes there. Production https://lamma-trivia.vercel.app remains separate/unmodified; prior Vercel team-scope authorization returned 403. Do not claim deployment.

System Node/npm are absent from PATH in this workspace. Bundled Node: /home/silver/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node. No dependencies are needed. Existing server on 127.0.0.1:4173 serves source dynamically; reload browser after edits. Runtime scratch work/ and dist/ are ignored.
