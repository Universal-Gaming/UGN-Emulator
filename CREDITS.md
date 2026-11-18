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
