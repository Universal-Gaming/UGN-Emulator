# UGN Emulator — The Universe of Consoles

A premium, interactive, 3D browser console-emulation experience for **Universal Gaming Network**. All playable titles are actual compiled console ROMs, not JavaScript substitutes.

**Live GitHub Pages:** https://universal-gaming.github.io/UGN-Emulator/

## Current catalog

- **31 actual console ROMs** are present in this repository.
- **9 represented hardware categories** have playable-file candidates: NES, SNES, Nintendo 64, Game Boy / Game Boy Color, Game Boy Advance, Sega Genesis, Atari 2600, and Neo Geo Pocket. Game Boy and Game Boy Color have separate filter categories but use the same EmulatorJS core.
- **16 console categories**, accurately labeled with authentic hardware photography when available. Categories without bundled licensed games say **COMING SOON**.
- No game imports, uploads, AI-made arcade games, or pretend playable titles.
- Three.js WebGL 3D hero showroom, adaptive UGN cosmic UI, actual console imagery, catalog filters, search, favorites, recent activity, keyboard/gamepad support via EmulatorJS, player fullscreen and emulator save states where supported.

## Emulator architecture

- Static GitHub Pages front end.
- Genuine compiled console ROMs from `roms/<console>/` loaded through EmulatorJS/WebAssembly.
- EmulatorJS cores currently load from the official public CDN: https://cdn.emulatorjs.org/stable/data/ . Therefore the game ROMs are bundled in-house, but the emulator runtime is **not yet self-hosted**.
- 3D scene loads Three.js via a pinned public CDN with a graceful CSS fallback.
- No account, server-side session, upload or tracking requirement. Favorites and recent history use localStorage.
- Collection installed-state checks use `HEAD` requests. A ROM download success is not the same as full game compatibility.

## Repository structure

- `index.html` — UGN console experience
- `styles.css` — responsive premium UI
- `app.js` — verified game catalog, system hardware showroom, playable ROM launching
- `roms/` — game binaries
- `.github/workflows/bundle-roms.yml` — homebrew ROM reproducible installation
- `CREDITS.md` — credits, licenses, legal sources

## Content and rights

Not every commercial game in the reference site can be mirrored. Internet Archive availability does **not** itself provide redistributing rights. Only the curated collection of independently published homebrew/freeware games has been installed, with upstream and license notices in [CREDITS.md](CREDITS.md).

Original console brands remain trademarks of their owners. UGN is independent of Nintendo, Sega, Sony, SNK and Atari.

## Verification

Checks should cover: ROM file presence and sizes, required NES headers, JavaScript syntax, available core URLs, and real-browser smoke tests. Do not announce a game as fully compatible until its controls, sound, rendering, gameplay and save state functionality have been tried in the browser.

## Design principles

A **console museum and emulator**, never a generic browser arcade. Immersive 3D, UGN cosmic colors, exact console identity, clear gameplay status, creator credits, accessibility and graceful performance fallback.

## Galactic Archive interactive experience

The primary page includes a fully explorable Three.js starship with sixteen interactive hardware pedestals and a planetary observation deck, cinematic entry with skip, holographic game-case browsing, quick 2D accessibility mode (`library.html`), optional synthesized ambient spacecraft audio, adjustable graphics quality, and local 3D gaming room customization.

Available room designs: 1980s Retro, 1990s Bedroom, 2000s Gaming Setup, Futuristic UGN, Premium Collector, and Cosmic Observation. You can add, drag, rotate, and remove objects; layouts are stored locally. Hardware console meshes are original stylized 3D approximations paired with real hardware photos, not licensed photogrammetry models. WebGL and network availability can affect how scenes render.
