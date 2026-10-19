# Current state — 20 October 2026

Bank: 51 categories × 24 entries = 1,224 (1,152 text + 72 listening), eight per point tier. Original IDs remain stable; question-supplement.mjs appends six rows per text category. The previous twelve-row expansion is retained. Several weak 600-point questions were replaced by precise mechanics, conditions and costs. Arabic corrections retain short English terms in parentheses where clearer; ARABIC_STYLE.md records the principles, references and access limits. There are 184 illustrated answers, including all listening rounds.

Selection: Change selection, Close, backdrop and Escape cancel the active question without points or changing the turn. Question-specific helpers are refunded. If the answer was revealed it is remembered as finished; otherwise it remains unfinished. Reopening draws a different eligible question when one exists. Cancelling a reopened undo question clears its answerSeen lock. Scores are only awarded explicitly. Category cards distinguish bank totals from the six match tiles.

History: anonymous cookie ID + localStorage flags, unfinished/unencountered preference, full-category reset only; exhausted tiers wait. Saved scores survive updates; new draws use the current bank. Storage-blocked sessions fall back to memory.

Listening: opaque black curtain, on-demand YouTube player, manual answer timer, lifecycle cleanup, answer art/credits on reveal. All 72 recordings have distinct IDs per category and 15-second bounds. Sources are official artists, labels, licensed Topic or distributor uploads; regional/embedding availability still varies. No music or lyrics are bundled.

Validation: 35 automated checks, module syntax and 16-file static build pass. Browser QA verified all cards at 24 and total 1,224; BG3 400 → RDR2 200 → BG3 400 changes the question; revealed cancellation works through Change selection and Close without scoring; persisted history remains after reload; black listening screen and reveal artwork/credits work.

Release: branch codex/deeper-trivia-audio, PR https://github.com/abdullaho21/sunjam/pull/1. The live site was verified to still have 378 entries before this release. Publication to the existing Vercel project lamma-trivia is the remaining release step. The release outcome will be recorded after the deployment request; do not infer production has changed from a local build.

Bundled Node (system PATH lacks Node/npm): /home/silver/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node. No dependencies. Existing localhost:4173 server serves source dynamically. dist/ and runtime work/ are ignored.
