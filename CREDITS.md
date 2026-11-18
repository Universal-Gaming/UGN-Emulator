# Game provenance and redistribution notices

UGN Emulator distributes only independently created console homebrew that has been represented as redistributable by its author or the upstream project. These are actual console ROM files, not JavaScript recreations.

| System | Included titles | Upstream | License |
|---|---|---|---|
| Game Boy / Game Boy Color | Tobu Tobu Girl Deluxe | [Simon Larsen](https://github.com/SimonLarsen/tobutobugirl-dx) | Code MIT; game assets CC BY 4.0 (attribution required) |
| Game Boy Color | µCity | [Antonio Niño Díaz](https://github.com/AntonioND/ucity) | GPLv3+ |
| Game Boy Color | Geometrix | [Antonio Niño Díaz](https://github.com/AntonioND/geometrix) | GPLv3 |
| Game Boy | Libbet and the Magic Floor | [Damian Yerrick](https://github.com/pinobatch/libbet) | zlib |
| NES | 2048 NES | [mmuszkow](https://github.com/mmuszkow/2048-nes) | Unlicense / public domain dedication |
| NES | 8-Bit Table Tennis | [mike42](https://github.com/mike42/8bit-table-tennis) | MIT |
| GBA | Cebelix, Dezgex, Mystic Q, Pik Roll | [gbadev museum](https://github.com/benoror/gbadev) | See upstream projects and license documentation; review before commercial redistribution |
| Sega Genesis | Tank Battle, Battle 4Tris, Space Shooter | [monteslu](https://github.com/monteslu/retro-homebrew-games) | MIT (see individual directories) |

Game Boy titles are redistributed via the [oxGBC example collection](https://github.com/mxmgorin/oxgbc/blob/main/crates/web/assets/README.md), which records detailed individual credits.

The binary ROMs are installed by [our GitHub Actions bundling workflow](.github/workflows/bundle-roms.yml). Game authors retain copyright unless expressly dedicated to the public domain. The upstream source and license govern all redistribution; please preserve these notices.

Console trademarks are owned by their respective companies. UGN Emulator is not affiliated with Nintendo, Sega, Sony, SNK, Atari or the game authors.

## Emulator core

The site integrates the independent open-source [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS) project. Emulation engines load from the upstream EmulatorJS CDN, while the bundled games are hosted directly in this repository; the core distribution is not yet fully self-hosted.

## Scope

The console selection reflects the reference site's NES, Genesis, Game Gear, 32X, Sega CD, Saturn, Game Boy/Color, GBA, DS, Neo Geo, Neo Geo Pocket, SNES, N64, PlayStation 1, Atari 2600, and Flash collections. **Only systems with built-in games are launchable**. Unlicensed commercial ROMs, BIOS images, and user-ROM upload or import interfaces are not provided.


## Additional console ROMs added to the 27-title collection

| System | Game | Creator | Licensing information / source |
|---|---|---|---|
| NES | Nova the Squirrel | NovaSquirrel | GPL-3.0 code / CC BY-NC-SA 4.0 assets — https://github.com/NovaSquirrel/NovaTheSquirrel |
| NES | Alter Ego | Shiru | Freeware — https://shiru.untergrund.net/software.shtml |
| NES | Spacegulls | Morphcat Games | Freeware — https://morphcatgames.itch.io/spacegulls |
| SNES | Super Boss Gaiden | Dieter von Laser / Chilly Willy | Freeware — https://www.romhacking.net/homebrew/60/ |
| SNES | N-Warp Daisakusen | d4s | Freeware — https://www.romhacking.net/homebrew/13/ |
| Nintendo 64 | Kumi-Daiko Beatoff 64 | Team Riistahillo | CC0 1.0 — https://github.com/N64brew-Game-Jam-2020/Kumi-Daiko-Beatoff-64 |
| Game Boy | Tobu Tobu Girl | Tangram Games | MIT code / CC BY 4.0 assets — https://github.com/SimonLarsen/tobutobugirl |
| Game Boy | Deadeus | -IZMA- | Freeware release — https://izma.itch.io/deadeus |
| GBA | Celeste Classic GBA | JeffRuLz (port) / Maddy Thorson and Noel Berry (original) | Free/open-source port; see project terms — https://github.com/JeffRuLz/Celeste-Classic-GBA |
| Genesis | Cave Story MD | andwn / Studio Pixel | MIT port, original game freeware — https://github.com/andwn/cave-story-md |
| Genesis | Ultimate Tetris | Haroldo O. Pinheiro | Freeware/open source — https://haroldo-ok.itch.io/ultimate-tetris |
| Genesis | Break An Egg | Studio Vetea | Freeware — https://buildbot.libretro.com/assets/cores/ |
| Atari 2600 | Sheep It Up! | Dr. Ludos | Freeware/open-source — https://drludos.itch.io/sheep-it-up |
| Neo Geo Pocket | Asteroids neo | Steven MacDonald | MIT — https://github.com/underscore42/ngpc-asteroids-neo |

These binaries originated from a compiled free-homebrew selection at https://github.com/Mylittlestories/recalbox-os-web/tree/main/www/roms, which documents its sources at https://github.com/Mylittlestories/recalbox-os-web/blob/main/www/roms/LICENSES.md. Freeware does not necessarily grant unrestricted commercial redistribution; review individual title permissions before monetizing the service.

## Hardware photography

Real-console photographs are loaded from Wikimedia Commons, principally the public-domain Vanamo Online Game Museum / Evan-Amos collection (https://commons.wikimedia.org/wiki/User:Evan-Amos). Source filenames are recorded in `app.js`. Any independently licensed Commons images are subject to their individual file pages.

## Technical note

EmulatorJS loads game cores from its public CDN. The game ROM files are included in this GitHub repository. Game compatibility, artwork availability and gameplay are separate verification concerns.

## Additional NES games from the Homebrew Hub

These four games are copied from the [NES Homebrew Hub](https://github.com/nesdev-org/homebrew-db), which includes the actual NES ROMs and creator metadata:

| Game | Creator | License | Source |
|---|---|---|---|
| Concentration Room | Damian Yerrick | GPL-3.0-or-later | [croom](https://github.com/nesdev-org/homebrew-db/tree/master/entries/croom) |
| RHDE: Furniture Fight | Damian Yerrick | FSF All-Permissive | [rhde](https://github.com/nesdev-org/homebrew-db/tree/master/entries/rhde) |
| Thwaite | Damian Yerrick | GPL-3.0-or-later | [thwaite](https://github.com/nesdev-org/homebrew-db/tree/master/entries/thwaite) |
| Zap Ruder | Damian Yerrick | zlib | [zap-ruder](https://github.com/nesdev-org/homebrew-db/tree/master/entries/zap-ruder) |

Upstream GPL source and corresponding terms remain available via the linked original projects; license obligations remain applicable to redistributed builds.

## Licensed homebrew expansion — 31 to 40 ROMs (November 18, 2026)

The following are **actual compiled console ROMs**, obtained from developers' original projects or Homebrew Hub entries carrying explicit game license declarations. All redistribution terms remain in force.

| Console | Game | Developer | Game license | ROM source and source project |
|---|---|---|---|---|
| NES | Cybercoaster | Fizzer & noby | Creative Commons Attribution 4.0 | [NES Homebrew Hub](https://github.com/nesdev-org/homebrew-db/tree/master/entries/cybercoaster) |
| Game Boy | 2048gb | Sanqui | zlib | [GB Homebrew Hub](https://github.com/gbdev/database/tree/master/entries/2048gb), [author's source](https://github.com/Sanqui/2048-gb) |
| Game Boy | AIRPLANZ | NotImplementedLife | GPL-3.0-only | [GB Homebrew Hub](https://github.com/gbdev/database/tree/master/entries/airplanz), [author's source](https://github.com/NotImplementedLife/AIRPLANZ) |
| Game Boy | Lost in Translation | All You Can Execute | Public-domain dedication | [GB Homebrew Hub](https://github.com/gbdev/database/tree/master/entries/lost-in-translation), [author's license](https://github.com/AYCEdemo/LostInTranslation/blob/main/LICENSE) |
| Game Boy | Adjustris | Dave VanEe | CC0 1.0 | [GB Homebrew Hub](https://github.com/gbdev/database/tree/master/entries/adjustris), [author's source](https://github.com/tbsp/Adjustris) |
| Game Boy | Dusky Dungeon (0.1.0) | Jan Klečka | MIT source code; CC BY 4.0 art | [GB Homebrew Hub](https://github.com/gbdev/database/tree/master/entries/dusky-dungeon), [author's MIT and CC BY licenses](https://github.com/inverted-hat/duskyDungeon) |
| Game Boy Color | A Slime Travel | Dribble Studios | zlib | [GB Homebrew Hub](https://github.com/gbdev/database/tree/master/entries/a-slime-travel) |
| Game Boy Advance | Apotris | akouzoukos | GPL-3.0 | [GBA Homebrew Hub](https://github.com/gbadev-org/games/tree/master/entries/apotris), [developer's corresponding source](https://gitea.com/akouzoukos/apotris) |
| Nintendo DS | Lunar Runner | Fulldive | MIT | [Original open-source homebrew project](https://github.com/fulldiveVR/FullRoid.Games/tree/master/repository/nds), [MIT license](https://github.com/fulldiveVR/FullRoid.Games/blob/master/LICENSE) |

Cybercoaster's author credit and CC BY 4.0 terms apply to its game data and any accompanying screenshots. Dusky Dungeon artwork requires CC BY attribution to Jan Klečka and other credited contributors as detailed by its original project's license and asset credits. Preserve the applicable GPL notices and access to the GPL source projects for AIRPLANZ and Apotris.

**No rights inference:** Merely appearing on GitHub, Internet Archive, or Homebrew Hub is not treated as permission to redistribute. Games with no explicit release permission were not added to the built-in collection. The separate 41,408-title catalog is a bring-your-own-copy index, not a ROM download list.

