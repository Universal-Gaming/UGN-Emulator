# UGN Emulator

A cosmic-themed, interactive console emulation site from Universal Gaming Network, hosted using GitHub Pages.

## What this project actually plays

**13 compiled, redistributable console homebrew ROMs**, preinstalled via GitHub Actions:
- Nintendo NES (2)
- Game Boy (1) and Game Boy Color (3) — both use the EmulatorJS Gambatte core
- Game Boy Advance (4)
- Sega Genesis (3)

The website uses actual EmulatorJS/RetroArch WebAssembly-based console cores. No JavaScript imitation games, ROM import controls, game uploads, or commercial copyrighted ROM collections. Gamepad and emulator save-state functionality are handled by EmulatorJS where supported.

All 17 systems shown by the reference site appear as categories, but **uninstalled consoles are explicitly marked as coming later** until appropriately licensed games are added and verified.

## Deployment

GitHub Pages is deployed from `main`. ROMs are downloaded, validated, and committed by `.github/workflows/bundle-roms.yml`. The game catalog checks that a ROM file exists before enabling its launch button.

Site: https://universal-gaming.github.io/UGN-Emulator/

## Credits and licenses

See [CREDITS.md](CREDITS.md). Game ROMs are self-hosted by GitHub Pages. EmulatorJS core scripts currently use its official CDN, rather than an in-repository copy.

## Verification limits

The GitHub Action validates downloads, nonempty files, and NES ROM headers. Such validation **does not establish that every game can be completed or runs perfectly**. Verify browser play, input, save-state behavior and audio on target devices before advertising full compatibility.
