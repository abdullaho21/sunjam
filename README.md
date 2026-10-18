# sunjam — لَمّة · Lamma

An Arabic RTL team trivia game inspired by the six-category party-trivia format.

Play the live version at [lamma-trivia.vercel.app](https://lamma-trivia.vercel.app).

## Run

Requires Node.js. No dependencies or secrets are needed.

```sh
npm run dev
npm run build
npm test
npm run check
```

Open the URL printed by the dev server, normally `http://localhost:4173`.

## Included

- 51 playable categories with 306 curated questions and listening rounds.
- Anime OP, ED and general song recognition; Red Dead Redemption 2; Clair Obscur: Expedition 33; roguelites; The Witcher 3; Baldur’s Gate 3; romance anime without ecchi titles; Metroidvania; JRPG; linear FPS; character action.
- Retained public category catalogue from Seen Jeem, with the requested category groups removed.
- Two teams, six selected categories, 36 questions, 200/400/600 point tiers.
- A once-per-team hint, 30-second extension and double-points helper.
- Reveal-and-award scoring, alternating turns, undo, final scores and rematch.
- Local progress and custom-bank persistence, favorites, search, category editor and JSON import/export.

## Content provenance and limits

The source catalogue was observed on [Seen Jeem's public category selector](https://seenjeemkw.com/start-game) on 18 October 2026. The full Seen Jeem question database was not obtained or copied. Questions in this project are new starter content, and no Seen Jeem logos, images or media files are included.

`catalog-source.json` preserves the observed names and exclusion groups. Retained categories without a starter bank appear in the separate catalogue view and cannot enter a game until they contain at least two questions at each points tier. Some visual/media-based categories therefore still need suitable question content and assets supplied by the owner.

Every OP/ED entry is now a listening question. A separate song-recognition category covers general music; this is the requested addition, while the previously excluded regional music catalogue groups stay excluded. All 18 rounds use 15-second excerpts, with recognition difficulty increasing from 200 to 400 to 600. OP 200 includes Demon Slayer and Chainsaw Man; 600 includes Serial Experiments Lain and Fate/stay night: Unlimited Blade Works. No Blue Bird.

The host opens the collapsed host panel, loads the official YouTube player, and presses play inside it if autoplay is blocked. The embed receives absolute start/end timestamps. The player remains visible to the host because YouTube titles and artwork can reveal the answer. Teams listen without seeing that panel, then the host starts the answer timer manually. Reveal displays the anime/song, track, artist and source. Timestamped official links are always available; external links start at the offset but require the host to stop playback at the displayed end time. Ads, regional restrictions, platform outages and embedding restrictions can affect playback. No recordings or lyrics are bundled or rehosted. Official uploads do not grant permission to rebroadcast or record copyrighted music.

Each category has two questions at each tier. The 288 text questions assume familiarity with the chosen subject: basic character/world recall at 200, specific quests or mechanics at 400, deeper systems and side content at 600. Story and expansion details may appear. Difficulty is editorial, not a claim of calibrated player success rates. `question-bank.mjs` stores explicit points; row position no longer determines difficulty. `audio-bank.mjs` stores curated sources and clip offsets, `media.mjs` validates them, and `audio-view.mjs` renders the host player. Romance starter content covers Your Lie in April, Kimi ni Todoke, My Love Story!!, Fruits Basket and Tsuki ga Kirei. It does not include ecchi titles.

Targeted checks covered Expedition 33’s [Stains and Twilight mechanics](https://clair-obscur.fandom.com/wiki/Skills), BG3’s [Wyrmway trials](https://bg3.wiki/wiki/Wyrmway) and [Silent Library book](https://bg3.wiki/wiki/Daughter_of_Darkness), and Arthur’s [Fenton alias](https://reddead.fandom.com/wiki/Advertising,_The_New_American_Art). Checked answers carry source links where applicable. These are original questions using factual subject knowledge, not a copied commercial bank. The remaining entries have had an editorial pass, not independent source verification of every fact.

All game progress and custom imports live in browser localStorage. They are not shared between devices or synced to a server. Export custom questions before clearing browser data. This is a playable first version, without accounts, online rooms, payment processing or a shared admin backend.

## Question packs

Download the example from the in-app question library, or use this structure:

```json
{
  "version": 1,
  "categories": [{ "id": "my-category", "name": "اسم الفئة", "group": "فئاتي" }],
  "questions": [
    { "categoryId": "my-category", "points": 200, "question": "نص السؤال", "answer": "الإجابة", "hint": "تلميح اختياري" }
  ]
}
```

Every imported category must have at least two questions at each of 200, 400 and 600 points. The app validates the entire file before saving. Use an existing category ID to append questions to it. Duplicate text questions in the same category are skipped; audio questions are matched by category, video ID and excerpt bounds, so different songs can share the same generic prompt. Source URLs, if provided, must use HTTPS. The upload limit is 2 MB, 200 categories and 5,000 questions per pack.

## Deploy on Vercel

The included `vercel.json` configures a static deployment: `npm run build` copies the thirteen runtime files to `dist/`. No dependencies or environment variables are needed. Tests, local preview helpers, and documentation are kept out of the published build.

## Validation

The automated suite covers category completeness and exclusions, match creation, scoring and helper invariants, undo after the final question, JSON persistence and import validation. Browser verification covers category selection, team setup, the board, helpers, reload/resume, reveal/award and undo.

## Audio imports and saved games

Audio rows use `type: "audio"` and a `media` object. `provider` must be `"youtube"`, `videoId` must be an 11-character ID, `startSeconds` and `endSeconds` must be integers exactly 15 seconds apart, and `title`, `artist`, and `channel` must be nonempty strings. Use official artist, label or distributor uploads and check their availability. No supplied iframe HTML or arbitrary embed URLs are accepted. Exporting the full bank preserves these fields. Text rows cannot be imported into the three built-in listening categories.

Existing matches retain their stored questions and score; a notice identifies old-bank matches. Start a new match for the revised content. Legacy text imports in built-in music categories stay in local storage but are omitted from new matches; unrelated custom categories are retained.

## Checks for this update

17 automated checks cover the original match/scoring behavior plus media validation, imports, hidden pre-reveal track metadata, clip identity, pause-on-open and persistence. Browser QA checked category selection, a 36-question match, the official host player, reveal/award/double points, undo and reload. YouTube timing uses its [documented start/end parameters](https://developers.google.com/youtube/player_parameters); seek boundaries may align to a nearby keyframe. Playback in every region and every source was not manually auditioned.

Publishing this update to the existing Vercel project is currently blocked by a 403 for its team scope. The connected account listed no teams, and no separately authenticated Vercel CLI was available. The previous production site is unchanged.

## Answer pictures (19 October 2026)

The reveal screen now shows curated pictures for **133 answers**, including **all 18 listening rounds**. Anime work artwork or official track thumbnails accompany music answers; other curated subjects include character portraits, game items, flags, cities, animals and historical figures. Gustave and Maelle use the official Expedition 33 character artwork. Character and item wiki assets, Wikipedia page images, and PokeAPI’s official-artwork collection have source links on each image. Some images are work cover art or diagrams, as identified by their caption. No image is generated from an answer-name search at runtime.

An image element is inserted only after Reveal, with alt text, a caption and a source link. The browser never preloads an answer picture while showing its question. If a remote image fails, its figure is hidden and the written answer/scoring remain usable. Answers without a verified suitable illustration remain text; the game does not substitute random category art. Remote artwork availability and reuse terms depend on its source, linked next to the picture.

Image metadata is in `answer-image-data.mjs`. `scripts/answer-image-topics.json` holds curated encyclopedia subjects; `scripts/answer-image-overrides.json` holds verified exact portraits and game assets. `python3 scripts/resolve-answer-images.py` refreshes the metadata through public page-image APIs and reapplies the reviewed overrides. This maintenance step requires network access; normal builds do not. Scratch research files in `work/` are excluded from source control.

Imported questions may supply `answerImages`, an array of up to four `{url, alt, source, caption, credit}` objects. Image and source URLs require HTTPS and must not contain credentials. Metadata survives JSON export/import and saved games. Existing seed matches without image metadata use the new curated mappings; imported IDs cannot impersonate seed artwork mappings.

Four additional automated checks cover pre-reveal absence, music/portrait coverage, persistence/imports and unsafe URL/markup rejection. Browser QA verified a real official Gustave portrait and anime artwork loading after Reveal, including the mobile layout.
