# UGN Room Studio — Galactic Archive Rooms

The playable console emulator and the Galactic Archive's room editor are separate. The **real console ROMs** launch through EmulatorJS; the rooms are original interactive 3D architecture.

## The photographic reference

The supplied reference room shows:
- Warm retro gaming bedroom surfaces and purple/cyan UGN sci-fi accents
- CRT television on a wood entertainment stand and a physical controller
- Full bookshelves of console games
- Illuminated glass console display tower
- Desk, monitor, gaming chair and neon holographic station
- Bed with geometric gamer bedding, sofa, low table and carpet
- Plant life, lava lamp, posters, miniature collectibles
- Panoramic futuristic station window with a large planet outside

**Photo-Match Retro Bedroom** is the default style. The 3D environment is intentionally constructed from original browser-rendered meshes, procedural patterns, and physical materials. It uses the reference photo as a comparison preview, not as a false replacement for an interactive 3D room. These models are detailed stylized reconstructions, **not** scans or photoreal asset replicas.

## Room presets

| Setting | Layout concept |
|---|---|
| Photo-Match UGN Retro Bedroom | Closest to supplied room image; 20 furnished objects |
| 1980s Retro Den | Wood finishes, CRT and classic gaming shelves |
| 1990s Gamer Bedroom | Retro CRT, bed, glass display, collectibles and carpet |
| Early 2000s Gamer Setup | Desk-led gaming setup, handheld and console displays |
| Futuristic UGN Lounge | Cyan-lit metal, dual glass cabinets and futuristic lounge |
| Premium Collector Gallery | Multiple glass cabinets and dense game-wall displays |
| Cosmic Observation Suite | Purple neon, bed, collection, planetary vistas |

Switching presets saves the current preset's layout independently, so returning to a previous preset restores its placed furniture.

## Furniture and settings

Available furniture: CRT television, entertainment stand, retro console, interactive UGN hologram station, neon UGN wall sign, real 3D controller, glass console display, populated game shelf, gamer bed, desk, gaming chair, couch, coffee table, area rug, floor lamp, lava lamp, plant, original UGN wall poster, collectible figure and snacks.

Settings include wall finishes, floor finishes, five colored lighting modes, optional animated holograms and lava-lamp effects, four atmospheric moods, shelf-population density, six observation-window scenes, and four featured systems inside each console display case.

To arrange the room:
1. Open the **MY GAMING ROOM** deck.
2. Pick a room style and camera viewpoint.
3. Click an object to select it; drag to move or use the directional nudge controls.
4. Rotate 45°, duplicate or remove objects. Optional grid snapping is enabled by default.
5. Click a CRT to open the genuine game library; select console exhibits in the glass case to inspect their related systems.
6. Use **UNDO**, **REDO**, **EXPORT ROOM**, **IMPORT LAYOUT** or **SAVE PHOTO** in the Save & Reset section.

Room layouts are saved automatically to this browser's local storage. The backup file is a plain JSON document with the layout and presets — **not** a ROM, emulator state, account, or server upload. Imported layouts are validated for supported furniture, finite positions and a 120-object limit.

The **COMPARE WITH REFERENCE** button overlays the exact supplied room image temporarily so the in-world arrangement can be judged against it.

## Performance and accessibility

- Procedural PBR material surfaces, textured wood, carpet, paneled walls, metallic flooring, illuminated console shelving, game-case cover art, screen and blanket patterns.
- Populated bookcases use instancing for better draw-call performance.
- Glass display pieces use transparent physical materials; small colored emissive accent strips substitute for hundreds of actual point lights.
- Room geometry is recreated on major style changes and old scene resources are disposed.
- Low, Balanced, High and Ultra global graphics presets remain available.
- The existing 2D game library works independently of WebGL, and no game title requires the 3D room to launch.

## Testing

\`tests/smoke.mjs\` checks room preset selection, a furnished starter scene, settings persistence, adding furniture, duplicate/undo/redo, photo-reference preview, camera views, and console-display selection. The GitHub Actions workflow also verifies the actual console emulation launcher and local-copy operation.

Automated smoke tests cannot prove photo-identical visual quality. They also don't establish that all of the commercial titles in the metadata catalog run, since ROMs for those games are deliberately not hosted.

## Photo-room expansion (November 2026)

The default photo-matched room contains a floating holographic control terminal and UGN neon wall sign in addition to the earlier CRT, bed, collector shelves, glass cases, couch, desk, and floor decor. Shelf cases feature original UGN-themed cover art rather than copied commercial box art. The desk includes an illuminated floating information panel; pressing the interactive terminal opens the console game library.

Ambient effects animate hologram visibility, ceiling panels, and lava-lamp blobs only while the room is visible and only on graphics presets other than Low. An **ANIMATED HOLOGRAMS & AMBIENT EFFECTS** checkbox disables these effects, and that preference saves with the room. The editor includes selectable controller, hologram, and neon sign objects with persistence, nudge/rotate/duplicate controls and JSON backup support.

The automated browser test checks renderer health and populated 3D geometry, not only that the UI menu appears. The procedural meshes are still optimized, stylized renderings; photo-identical fidelity would require substantially more authored geometry and high-resolution textured models.
