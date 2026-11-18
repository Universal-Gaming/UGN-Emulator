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

The console selection reflects the reference site's NES, Genesis, Game Gear, 32X, Sega CD, Saturn, Game Boy/Color, GBA, DS, Neo Geo, Neo Geo Pocket, SNES, N64, PlayStation 1, Atari 2600, and Flash collections. **Only systems with built-in games are launchable**. Unlicensed commercial ROMs and BIOS images are not provided. The optional browser-only "Use My Copy" selector supports locally owned compatible files without uploading them to UGN.


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


## Additional 22 open-licensed Game Boy / Game Boy Color games (40 → 62)

For every title below, its **individual Homebrew Hub metadata** explicitly identifies the game as a playable ROM and declares the listed license. The independent Homebrew Hub database's own GPL license was *not* used as a substitute for game authorization. Each ROM was fetched from that exact entry in the [gbdev/database](https://github.com/gbdev/database) repository.

| Console homebrew title | Original credited developer | Published license | File and original metadata |
|---|---|---|---|
| PlantBoy | exezin | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/plantboy) |
| Rex Runner GB | The Void | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/rex-runner-gb) |
| Potion Panic (Demo) | DevEd | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/deved_potion-panic) |
| Squishy the Turtle | Cppchriscpp | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/squishy-the-turtle) |
| Tuff | BonsaiDen | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/tuff) |
| Rebound | DevEd | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/rebound) |
| Flooder | Oliver Balfour | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/flooder) |
| Max Pirate | Lemmy Hawkins | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/maxpirate) |
| Domination | Graham Coulby (IonicLimb) | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/domination) |
| CrossConnect | quinnp | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/crossconnect) |
| Grub Glide | Ethan Hazel | zlib | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/grub-glide) |
| Crystal Lake | VHVS | zlib | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/crystal-lake) |
| Shock Lobster | tbsp | zlib | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/shock-lobster) |
| Carazu | Martin Holtkamp | GPL-3.0-or-later | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/carazu) |
| Big2Small | mdsteele | GPL-3.0-or-later | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/big2small) |
| GB-Wordyl | bbbbbr | GPL-3.0 | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/gb-wordyl) |
| El Dueloroso | Adrián JG | GPL-3.0 | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/el-dueloroso) |
| Rex Run | el_seyf | GPL-3.0 | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/rex-run-v1-0) |
| Escape Obliterizer Deluxe | João Godinho | GPL-3.0 | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/escape-obliterizer-dx) |
| Bit Bang | StudioGuma | GPL-3.0-or-later | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/bit_bang) |
| Sushi Nights | Zalo | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/sushi-nights) |
| Porklike GB | binji | MIT | [Author-supplied ROM and license metadata](https://github.com/gbdev/database/tree/master/entries/porklike-gb) |

License references and copyright attribution remain the original authors'. MIT licenses require retention of applicable copyright/permission notices; GPL titles require access to corresponding source. See each linked original game entry and follow its own upstream source links and notices. For older freeware entries with no explicit permission to redistribute, UGN continues to use the **Use My Copy** loader rather than bundling a ROM.

**Important:** The catalog includes games with similar genre mechanics to historical commercial games, but no Nintendo, Sega, or Sony commercial cartridge dump has been added in this batch.

## November 18, 2026: Additional 17 explicitly licensed console games

Each of the following Homebrew Hub entries has a `game.json` **game-specific license field**, a declared playable compiled console binary, and a repository-hosted ROM checked against its original byte length. Those claims were inspected individually; the Homebrew Hub database license alone is not permission to redistribute a game. Attribution is retained here and in the source manifest. The author's original code and rights notices remain authoritative.

| System | Title | Creator | Declared ROM/game license | Upstream game metadata |
|---|---|---|---|---|
| GB | Madpews Battlegrounds | madpew | Unlicense | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/madpews-battlegrounds/game.json) |
| GB | JP | Graham Coulby (IonicLimb) | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/jp/game.json) |
| GBC | Namihey | TeamKNOx | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/gunpey/game.json) |
| GBC | Deep Scan | TeamKNOx | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/deep-scan/game.json) |
| GB | Renegade Rush | quinnp | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/renegade-rush/game.json) |
| GB | Dawn Will Come | eishiya | MIT code / CC BY 4.0 art | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/dawn-will-come/game.json) |
| GBC | Airaki | furrtek | GPL-3.0-or-later | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/airaki/game.json) |
| GB | Corrib75 | gearfo | GPL-3.0 | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/corrib75/game.json) |
| GB | Game (Boy) of Life | StudioGuma | GPL-3.0-or-later | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/game_boy_of_life/game.json) |
| GB | Max Pirate Extra Boom | Lemmy Hawkins | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/maxpirateeb/game.json) |
| GB | Pelmanism | TeamKNOx | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/gbccardgame/game.json) |
| GB | PostBot | Tobias Rojahn | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/postbot/game.json) |
| GBC | GBHack | statico | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/gbhack/game.json) |
| GB | GB Corp. | Dr. Ludos | MIT | [Game and license metadata](https://github.com/gbdev/database/blob/master/entries/gb-corp/game.json) |
| GBA | piuGBA Demo | Afska | MIT | [Game and license metadata](https://github.com/gbadev-org/games/blob/master/entries/piugba/game.json) |
| GBA | GRIMLIGHT: The Hollow Bell | retroromrunner | MIT | [Game and license metadata](https://github.com/gbadev-org/games/blob/master/entries/grimlight/game.json) |
| GBA | MeteoRain | Dr. Ludos | MIT | [Game and license metadata](https://github.com/gbadev-org/games/blob/master/entries/meteorain-gba-jam-2021/game.json) |

Source binaries and original byte sizes for reproducible downloads are recorded in [`catalog/licensed-rom-expansion.json`](catalog/licensed-rom-expansion.json). The artwork in Dawn Will Come is subject to **CC BY 4.0 attribution to eishiya**, even though its code is MIT licensed. Games under GPL remain covered by their GPL obligations; authors' source repository links are available through the linked upstream metadata. `piuGBA Demo` is the original demo, not a promise of bundled licensed music charts beyond what its author published.
