# UGN Emulator — The Universe of Consoles

A premium, interactive, 3D browser console-emulation experience for **Universal Gaming Network**. All playable titles are actual compiled console ROMs, not JavaScript substitutes.

**Live GitHub Pages:** https://universal-gaming.github.io/UGN-Emulator/

## Current catalog — two ways to play

- **41,408 console title / edition entries**, generated from **16 console categories** in the [Libretro Database](https://github.com/libretro/libretro-database). This is a searchable title index, **not 41,408 hosted games**.
- **62 hosted console homebrew ROMs** that can launch without a visitor supplying files, across ten system categories.
- **Use My Copy:** select a title in the larger index, then choose a locally held ROM or disc image. Files are passed to an EmulatorJS core using browser `blob:` object URLs, not uploaded to UGN; BIOS file selection is available where needed. Some systems and formats require additional BIOS data, compatible disc layouts and capable devices. The catalog does not confer game distribution rights.
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
- `room-studio.js` — photo-inspired PBR gaming bedroom and editable furniture scenes
- `ROOM_STUDIO_GUIDE.md` — room editing, custom layouts, save/export and performance details
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

Available room designs: the photo-matched UGN Retro Bedroom, 1980s Retro, 1990s Bedroom, 2000s Gaming Setup, Futuristic UGN, Premium Collector, and Cosmic Observation. Each has its own furnished layout, materials, lighting, window views and locally saved customization. Add, drag, rotate, duplicate, remove, undo and redo objects; export/import layouts as JSON or save a room screenshot. See [the Room Studio guide](ROOM_STUDIO_GUIDE.md) for the full feature set. Hardware console meshes are original stylized 3D approximations paired with real hardware photos, not licensed photogrammetry models. WebGL and network availability can affect how scenes render.

## Catalog copyright and credit

The 41,408-entry name and region database is adapted from [libretro/libretro-database](https://github.com/libretro/libretro-database), licensed under [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/). The UGN transformation removes machine checksums and ROM links, filters some versions, and splits the data into browser-sized console-specific JSON files. That adapted metadata is made available under **CC BY-SA 4.0**. This license does not grant rights to commercial game ROM files or copyrighted game-box artwork. See [catalog/README.md](catalog/README.md).

## Testing

GitHub Actions runs a real Chromium smoke suite covering the 3D experience, room editing, hosted ROMs, title search, and file-input emulation startup. Automated tests cannot guarantee that every cataloged game or BIOS file works on every device.

## November 18, 2026: Licensed Library Expansion

Nine independently published homebrew console titles were added, bringing the repository to **62 actual compiled console ROMs**. The new entries cover NES, Game Boy, Game Boy Color, Game Boy Advance, and the project's first preinstalled **Nintendo DS** ROM. All launch through real console-emulation cores. Both expansions are separate from the 41,408-entry bring-your-own-game title index, which remains metadata only.

The game card ID bug was corrected: every installed game now uses a unique, stable identifier based on its ROM path. Previously, all games belonging to a console could share an identifier and accidentally launch the first ROM for that system. The automated browser tests now check this behavior.

Original developer credits, exact ROM source paths, and licenses are recorded in [CREDITS.md](CREDITS.md). Files are obtained through the repository's reproducible [ROM bundling workflow](.github/workflows/bundle-roms.yml); no commercial cartridge backups are bundled.

## November 2026: 62-game console collection

The repository now includes 62 verified-on-disk ROM binaries: 10 NES, 2 SNES, 1 Nintendo 64, 26 Game Boy, 8 Game Boy Color, 6 GBA, 1 Nintendo DS, 6 Sega Genesis/Mega Drive, 1 Atari 2600, and 1 Neo Geo Pocket. All are original-console binaries; none are browser JavaScript arcade remakes. Licensing is documented individually in [CREDITS.md](CREDITS.md). The broader 41,408-title catalog remains a metadata-only discovery and bring-your-own-copy library. **File presence is not a claim that every title has completed individual visual, audio, controller, and save-state compatibility testing.**
