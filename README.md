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

- 50 playable categories and 378 original Arabic questions.
- Anime OP and ED; Red Dead Redemption 2; Clair Obscur: Expedition 33; roguelites; The Witcher 3; Baldur’s Gate 3; romance anime without ecchi titles; Metroidvania; JRPG; linear FPS; character action.
- Retained public category catalogue from Seen Jeem, with the requested category groups removed.
- Two teams, six selected categories, 36 questions, 200/400/600 point tiers.
- A once-per-team hint, 30-second extension and double-points helper.
- Reveal-and-award scoring, alternating turns, undo, final scores and rematch.
- Local progress and custom-bank persistence, favorites, search, category editor and JSON import/export.

## Content provenance and limits

The source catalogue was observed on [Seen Jeem's public category selector](https://seenjeemkw.com/start-game) on 18 October 2026. The full Seen Jeem question database was not obtained or copied. Questions in this project are new starter content, and no Seen Jeem logos, images or media files are included.

`catalog-source.json` preserves the observed names and exclusion groups. Retained categories without a starter bank appear in the separate catalogue view and cannot enter a game until they contain at least two questions at each points tier. Some visual/media-based categories therefore still need suitable question content and assets supplied by the owner.

Anime OP/ED questions use song-title and artist clues. They do not play audio. Romance starter content covers Your Lie in April, Kimi ni Todoke, My Love Story!!, Fruits Basket and Tsuki ga Kirei. It does not include ecchi titles.

Expedition 33 character facts were checked against the [official character guide](https://www.expedition33.com/overview/characters). Other starter questions use established general knowledge and game/anime facts; individual difficulty ratings are editorial. A production question catalogue should receive a further editorial review before commercial release.

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

Every imported category must have at least two questions at each of 200, 400 and 600 points. The app validates the entire file before saving. Use an existing category ID to append questions to it. Duplicate question text within the same category is skipped. Source URLs, if provided, must use HTTPS. The upload limit is 2 MB, 200 categories and 5,000 questions per pack.

## Deploy on Vercel

The included `vercel.json` configures a static deployment: `npm run build` copies the seven runtime files to `dist/`. No dependencies or environment variables are needed. Tests, local preview helpers, and documentation are kept out of the published build.

## Validation

The automated suite covers category completeness and exclusions, match creation, scoring and helper invariants, undo after the final question, JSON persistence and import validation. Browser verification covers category selection, team setup, the board, helpers, reload/resume, reveal/award and undo.
