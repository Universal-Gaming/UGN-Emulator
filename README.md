# UGN Emulator — The Universe of Consoles

A premium, interactive, 3D browser console-emulation experience for **Universal Gaming Network**. All playable titles are actual compiled console ROMs, not JavaScript substitutes.

**Live GitHub Pages:** https://universal-gaming.github.io/UGN-Emulator/

## Current catalog — two ways to play

- **41,408 console title / edition entries**, generated from **16 console categories** in the [Libretro Database](https://github.com/libretro/libretro-database). This is a searchable title index, **not 41,408 hosted games**.
- **31 hosted console homebrew ROMs** that can launch without a visitor supplying files, across nine system categories.
- **Use My Copy:** select a title in the larger index, then choose a locally held ROM or disc image. Files are passed to an EmulatorJS core using browser `blob:` object URLs, not uploaded to UGN; BIOS file selection is available where needed. Some systems and formats require additional BIOS data, compatible disc layouts and capable devices.
- **Original artwork from the user** is included as optimized WebP files in `assets/`. It provides the starship entrance backdrop, museum/room concepts, and console boot visuals. These are cinematic photographs, while interactive navigation uses actual Three.js geometry.
- Authentic box art is requested from the external Libretro thumbnail service when it has a matching entry; image availability and third-party rights vary by title.
- All 16 categories appear in the museum, with a playable homebrew collection and a much broader local-copy title index.
- No made-up arcade mini-games and no preinstalled commercial console ROMs.

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
- `roms/` — licensed redistributable game binaries
- `catalog/byo/` — real console title indexes (no game binaries)
- `copy-library.js` — full title browsing and local ROM/BIOS file launch
- `assets/` — optimized visual reference images supplied by the project owner
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

## Catalog copyright and credit

The 41,408-entry name and region database is adapted from [libretro/libretro-database](https://github.com/libretro/libretro-database), licensed under [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/). The UGN transformation removes machine checksums and ROM links, filters some versions, and splits the data into browser-sized console-specific JSON files. That adapted metadata is made available under **CC BY-SA 4.0**. This license does not grant rights to commercial game ROM files or copyrighted game-box artwork. See [catalog/README.md](catalog/README.md).

## Testing

GitHub Actions runs a real Chromium smoke suite covering the 3D experience, room editing, hosted ROMs, title search, and file-input emulation startup. Automated tests cannot guarantee that every cataloged game or BIOS file works on every device.
