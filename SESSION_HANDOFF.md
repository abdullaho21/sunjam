# Current update — 18 October 2026

The question overhaul is implemented in the current source: 51 categories and 306 entries (288 text questions plus 18 listening rounds). Explicit 200/400/600 difficulty replaces position-based assignment. OP/ED and general songs use official YouTube sources, 15-second bounds, a collapsed host player, a manual answer timer and reveal. The user chose familiarity/niche as the main music difficulty control; all clips stay 15 seconds and Blue Bird is omitted.

See README.md for the current import format, validation, saved-game compatibility and source limitations. The original state below is retained as historical context and is superseded by this update.

Vercel publishing is blocked: explicit access to `team_c9vWqAC5SmzmG8DCsXkJGKpX` returned 403 and the connector listed no teams. No Vercel CLI with independent credentials is installed. Do not claim the new source is deployed at the production URL.

---

## Historical handoff before this update

# Sunjam / Lamma — continue on Linux

Saved on 18 October 2026 after the Windows build session.

- Source repository: https://github.com/abdullaho21/sunjam
- Live game: https://lamma-trivia.vercel.app
- Main implementation commit: `e4cba46f71e7fb0520044b71860711a1bce53080`

This document describes the repository's technical state so work can continue on Linux. It contains no full chat transcript or chat-sharing URL.

## User's requirements

Build an Arabic team trivia competitor inspired by https://seenjeemkw.com/ and keep the existing public categories except these groups:

`فن خليجي`, `بنات`, `الأردن`, `البحرين`, `الإمارات`, `عمان`, `قطر`, `الكويت`, `مسرح`, `فن عربي`, `أغاني`, `فن تركي`, `كرة قدم`.

The removal list was interpreted as whole groups, with related country, football and song categories also filtered from the new-category section.

Add these requested categories:

- Anime OP and Anime ED.
- Red Dead Redemption 2.
- Clair Obscur: Expedition 33.
- General roguelites.
- The Witcher 3.
- Baldur's Gate 3.
- Romance anime, excluding ecchi.
- Metroidvania.
- JRPG.
- Linear FPS.
- Character action games.

## Implemented state

The app is branded **لَمّة / Lamma** in the `sunjam` repository. It is a dependency-free HTML/CSS/JavaScript app with Arabic RTL layout. The seed bank has **50 playable categories and 378 original questions**, including all 12 requested additions above. There are **137 additional retained catalogue categories awaiting question content**. Those categories are clearly separated from playable categories.

Games have two teams, six selected categories and 36 questions: two questions at each of 200, 400 and 600 points in each category. Players answer verbally, reveal the answer and select the winning team or no winner. Turns alternate after each question. There are three once-per-team helpers: hint, 30 extra seconds and double points. Undo, results, rematch, favorites and saved progress work.

The question library supports browsing, creating categories and validating/importing/exporting JSON packs. Custom content and progress use browser localStorage; they are not synchronized between Windows and Linux. The application's seed bank and source files are stored in GitHub.

## Content limitations to preserve

- Public category names were collected with Firecrawl from https://seenjeemkw.com/start-game on 18 October 2026.
- The full Seen Jeem question database was **not** obtained or copied. Starter questions were newly written. The app and README disclose this.
- OP/ED questions use text clues about song names and performers. They do **not** currently play audio.
- The romance bank covers Your Lie in April, Kimi ni Todoke, My Love Story!!, Fruits Basket and Tsuki ga Kirei. Do not add ecchi titles.
- Visual/media-based catalogue categories still need suitable question content and assets.
- This first version has no accounts, online rooms, payments or shared server-side question administration.

## Run and validate on Linux

```sh
git clone https://github.com/abdullaho21/sunjam.git
cd sunjam
npm test
npm run check
npm run build
npm run dev
```

No package installation or secrets are needed. The preview listens at `http://localhost:4173` by default. `npm run build` copies the seven runtime files into `dist/`. The included `vercel.json` uses this build.

Validation completed in Windows: all seven automated tests pass; syntax checks and the static build pass. Browser QA covered category selection, team setup, a 36-question board, hints, extended time, doubled scoring, refresh/resume, reveal/award, undo, exclusions and custom category creation. The public Vercel deployment rendered successfully.

## Deployment state

- Existing Vercel project: `lamma-trivia`.
- Project ID: `prj_J2n7RBMx5UR65t3Wbg9tdbyHDWwk`.
- Latest verified deployment: `dpl_7ribXBn8166ndBhDsEqs6Zn8YfRF`, production, READY.
- Stable URL: https://lamma-trivia.vercel.app
- Deployment used uploaded static source files before GitHub access was granted. Automatic deployments from GitHub are **not confirmed/configured**. Do not claim the project is automatically linked to the repository.
- GitHub access initially returned 403. The user enabled `sunjam` access for the connected GitHub app, and the complete application was then successfully committed to `main`.

## Useful next work

Read the user's next instruction. Likely extensions are more original questions for the retained catalogue, proper audio rounds for OP/ED, editorial fact checking, and connecting the existing Vercel project to this GitHub repository for automatic deployments. Do not silently replace the original questions with unverified copied question banks.
