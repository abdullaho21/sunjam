# sunjam — لَمّة · Lamma

An Arabic RTL trivia game for two teams. Pick six categories, then play a 36-tile board with 200/400/600 points.

The existing [production site](https://lamma-trivia.vercel.app) is separate from this source branch. This update is uploaded to [PR #1](https://github.com/abdullaho21/sunjam/pull/1); it has not been merged or deployed.

## Run

Requires Node.js; no dependencies, accounts, API keys or secrets.

```sh
node server.mjs
```

Open `http://localhost:4173`. Leave the terminal running. Alternatively use `npm run dev`.

```sh
node scripts/test.mjs
node scripts/build.mjs
```

`npm test`, `npm run build` and `npm run check` are also available. The static build copies 15 runtime files into `dist/`. `vercel.json` specifies the build command and output folder.

## Content

There are **51 playable categories and 918 entries**: **864 text questions and 54 listening rounds**. Every category now has **18 entries**, six per tier—12 more than the previous bank. A match uses only two tiles per tier in each selected category.

Games include RDR2, Expedition 33, roguelites, The Witcher 3, BG3, Metroidvania, JRPG, linear FPS and character action. Other categories cover anime, romance anime without ecchi titles, literature, geography, science, religion, sports and more. The previously excluded regional, football and music catalogue groups remain excluded; general song recognition is a separate requested category.

200 assumes familiarity with the chosen subject; 400 asks for more specific recall; 600 uses deeper mechanics, equipment, side characters and optional content. Sciel’s old Sun/Moon giveaway is replaced by Fortune’s Fury’s AP cost, exact multiplier and duration. Other overvalued giveaways were replaced, including BioShock’s control phrase, V’s familiars and the number of Bind teleporters. Difficulty is editorial, not a measured player success rate. Story and expansion details may appear.

`question-bank.mjs` contains the original six rows per text category, reviewed in place. `question-expansion.mjs` adds 12 distinct rows to every text category without renumbering the existing IDs. `audio-bank.mjs` contains the 54 recording selections and timestamps. Points are explicit, never inferred from row position.

Targeted source checks include [Expedition 33 skills](https://clair-obscur.fandom.com/wiki/Skills), [Chevalam](https://expedition33.wiki.fextralife.com/Chevalam), [Thermal Transfer](https://expedition33.wiki.fextralife.com/Thermal_Transfer), [Wyrmway](https://bg3.wiki/wiki/Wyrmway), [Legendary Jokers](https://balatrowiki.org/w/Legendary_Jokers), [King Cerberus](https://devilmaycry.fandom.com/wiki/King_Cerberus_(Devil_Arm)) and [VALORANT’s wiki](https://wiki.playvalorant.com/). Checked clues carry source links where applicable. The full 918-entry bank has had an editorial pass; not every fact was independently source-audited.

The separate category catalogue comes from [Seen Jeem’s public selector](https://seenjeemkw.com/start-game), observed 18 October 2026. These are newly written questions, not a copy of its commercial question bank. No Seen Jeem branding or media is included. Catalogue-only categories become playable when supplied with at least two questions per tier.

## Remembering questions

`question-history.mjs` manages one anonymous profile per browser. A `lamma_player` cookie contains a random ID, expires after one year, and uses SameSite=Lax plus Secure on HTTPS. Completed/encountered question IDs are stored under that profile in localStorage, keeping the growing history out of the cookie and HTTP requests. There is no server history database or cross-device sync.

Questions are drawn when a tile is opened. The draw is randomized among unfinished questions of the appropriate category and point tier, preferring questions not yet encountered. Selecting a result—including “nobody”—marks the question finished. Finished questions do not repeat until **all questions in that category** have been finished; the next draw starts a new cycle for that category only. New questions added later join the unfinished pool.

If one tier runs out before the rest of its category, its fresh-question tiles wait until the other tiers finish. This avoids silently recycling 200-point questions while new 400/600 questions remain. Category completion counts are visible on the board.

Closing an unrevealed question abandons it without marking it finished or changing the turn. Its helpers are restored, and reopening that tile chooses a different unfinished question when one exists. Encounters rotate across different tiles and matches too. If only one unfinished question remains in that tier, it is retained rather than repeating a finished question. Revealed answers must be scored; undo retains that question for correcting the result.

Match scores, custom packs, favorites and history stay in this browser. Clearing site data clears them. If storage is blocked, play still works with in-memory history for that page session. Old saved matches retain their results, and a revision notice identifies them; new draws use the current bank.

## Listening rounds

OP, ED and songs each have 18 distinct recordings. Every excerpt is 15 seconds; familiarity and niche selections determine the tiers. Demon Slayer and Chainsaw Man are among the easy openings. Harder selections include Lain, ACCA, Rakugo Shinjuu, Girls’ Last Tour and Shinsekai Yori. Blue Bird is omitted.

Play/replay loads the YouTube IFrame API on demand and starts the bounded excerpt. An opaque **black curtain**, installed before the player loads, covers the video, title and thumbnail. The concealed player is inert to keyboard and assistive-technology focus. The audience sees a music symbol and generic listening prompt. The answer timer stays paused until “start answer time.” Stop, close, reveal and timer-start destroy the player; closing while the API is loading also prevents late playback.

The host can explicitly uncover the player in troubleshooting settings if the browser blocks autoplay or the player needs interaction, then cover it again. This may expose the answer and is intended for the host only. A generic status reports blocked autoplay, playback completion or embedding failure. Start/end parameters and a current-video-time boundary stop the excerpt; seeking can align to a nearby keyframe. See the [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference).

On reveal the game displays the anime/song, recording title, artist, credited official channel, artwork and timestamped source link. Sources use official artist, label, licensed Topic or distributor uploads. No recordings or lyrics are bundled, extracted or rehosted. Regional restrictions, ads and embedding settings can still affect a recording. Not all 54 sources have been manually auditioned in every region.

## Reveal pictures and imports

There are **166 illustrated answers**, including **all 54 listening rounds**. Other illustrations include official Expedition 33 portraits and curated characters, game items, places, animals and flags. Artwork is inserted only after Reveal, with alt text, caption and source link. Failed remote pictures hide without blocking scoring. Answers without a suitable verified illustration stay text; unrelated category art is not substituted. Images for replaced answers are suppressed if their old mapping would be misleading.

`answer-image-data.mjs` stores curated metadata. Topic/override manifests and `scripts/resolve-answer-images.py` support refreshing it using public page-image APIs. That maintenance step needs network access; normal builds do not. Remote availability and reuse terms depend on the linked source.

JSON packs use `{version:1,categories:[...],questions:[...]}`. Use the in-app template/export for examples. Each imported category needs two questions per tier. The app accepts up to 2 MB, 200 categories and 5,000 questions, validates the whole pack and skips duplicate text/media identities. Source and image URLs require HTTPS.

Audio fields are `type:"audio"` and `media:{provider:"youtube",videoId,startSeconds,endSeconds,title,artist,channel}`. IDs must have 11 characters; excerpt bounds are integers exactly 15 seconds apart. Arbitrary embed HTML is not accepted. Text-only rows cannot enter the built-in listening categories. Images use up to four `{url,alt,source,caption,credit}` objects per question. Validated media/images survive exports, imports and saved matches.

## Verification

33 automated checks cover all category counts and tiers, distinct recordings, scoring, helpers, imports, answer-image safety, history persistence, three matches without repeats, category reset, exhausted-tier behavior, skipped draws, undo and player lifecycle. Syntax checks and the static build pass.

Browser QA verified 918 entries, abandoned-question replacement after switching categories, completion counts surviving reload, the actual black screen over a live player, excerpt completion, player removal on answer time, and a real remote thumbnail appearing on reveal. No browser errors were observed in that flow. Deployment to the existing Vercel project was previously unavailable because its team scope returned 403; this PR update does not change production.
