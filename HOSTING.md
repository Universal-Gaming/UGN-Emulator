# UGN Emulator — hosting and release playbook

## What's ready and what isn't
UGN Emulator is a static web application with a 3D starship archive and a low-graphics `library.html` alternative. It has **79 bundled actual console homebrew ROMs** and a separate **41,408-title metadata-only** personal-copy index. Do **not** tell visitors that all 41,408 games are hosted or that every ROM has passed a full playthrough.

Developer screenshots and box-art URLs remain third-party assets; all missing artwork gracefully falls back to clearly labeled original UGN archive-cover SVGs. These SVGs are not represented as official game artwork.

## GitHub Pages
Published at https://universal-gaming.github.io/UGN-Emulator/

Repository: https://github.com/Universal-Gaming/UGN-Emulator/

The site uses relative paths and includes `.nojekyll`, allowing GitHub Pages project-site hosting without a build step. Publish from the repository's default branch/root directory. Allow Pages deployment to finish after every release.

## Deploy to another static web host
Deploy the **entire repository content** (except any nonessential .git state) to a single HTTPS origin, keeping these paths intact:
- `index.html` and `library.html`
- `app.js`, `artwork.js`, `copy-library.js`, `galactic.js`, `room-studio.js`, CSS and supporting scripts
- `assets/`, `catalog/`, and `roms/` with all 79 binaries

Required web behavior:
- Serve HTML, JS, CSS and JSON with their correct MIME types; serve `.wasm` as `application/wasm` if self-hosting a compatible emulator core later.
- Serve unknown binary ROM file extensions as `application/octet-stream`.
- Support GET and HEAD on ROM paths. Never rewrite a missing `roms/*` path to an HTML fallback.
- HTTPS is strongly recommended for gamepad access, audio/fullscreen integrations and secure browser features.
- Set `Cache-Control: no-cache` on HTML and `catalog/hosted.json`; avoid long caching for files whose names are reused.
- Preserve exact case-sensitive filenames on Linux. Do not omit files above 1 MB.
- Protect the site with appropriate TLS, `X-Content-Type-Options: nosniff` and a reasonable Referrer-Policy.

A basic Nginx site rooted at `/srv/ugn-emulator` can use:

```nginx
server {
    listen 80;
    server_name emulator.example.com;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name emulator.example.com;
    root /srv/ugn-emulator;
    index index.html;
    ssl_certificate /path/to/valid/fullchain.pem;
    ssl_certificate_key /path/to/valid/privkey.pem;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    location / { try_files $uri $uri/ =404; }
    location = /catalog/hosted.json { add_header Cache-Control "no-cache"; }
}
```

Configure MIME types at the server's `http` level with `include mime.types;` and `default_type application/octet-stream;`. Use Let's Encrypt or an equivalent trusted certificate in place of the example certificate paths. Always run `nginx -t` before reloading.

## Dependencies and compatibility
- EmulatorJS loads from https://cdn.emulatorjs.org/stable/data/ . Hosting only the UGN repository does **not** make this emulator fully offline/self-hosted. Version-pinning and self-hosting a reviewed EmulatorJS release are recommended before promising uptime independent of the upstream CDN.
- Three.js currently loads from a separate pinned CDN. If WebGL, GPU acceleration or third-party loading fails, visitors can open `library.html` instead.
- Highly demanding systems, some CD images and consoles needing BIOS or cross-origin isolation may not work on GitHub Pages or on all phones/tablets.
- Game save states and personal favorites are browser/device dependent; do not promise cross-device cloud sync.

## Copyright and licenses
Read `CREDITS.md` and individual upstream licenses for all ROMs and screenshots before commercial monetization, mirroring or advertising. Freeware is not automatically permission to redistribute. Do not bundle proprietary BIOS or commercial ROMs without proper rights. The 41,408-title Libretro-derived metadata is CC BY-SA 4.0; preserve notices. UGN cover fallback designs are original archive art, not counterfeit screenshots.

## Automated release gate
1. GitHub Actions `Bundle licensed console ROMs`: completed successfully, 79 ROMs present.
2. GitHub Actions `Verify UGN Emulator`: green, with 79 ROM/manifest validation, JavaScript syntax, image fallback and mobile tests, desktop controls and browser emulation startup.
3. GitHub Pages deployment: successful and the live URL loads without 404/console errors.
4. Manually test a selection of games across all ten installed console categories for audio, controls, gamepad support, save-state behavior and replay.
5. Test `index.html` and `library.html` on Chrome desktop, Firefox desktop, Safari iOS and Chrome Android.
6. Check all packaging/artwork rights before public commercial hosting.

There is no way to certify a game collection as mathematically bug-free; record verified platforms and known limitations clearly rather than claiming 100% compatibility.

## Licensing checkpoint before monetization

The current collection includes third-party freeware and art with **noncommercial conditions**, including Nova the Squirrel's CC BY-NC-SA assets. The Break An Egg developer also expressly describes his game as copyrighted freeware and has granted noncommercial sharing permission in a public discussion. Neither fact establishes blanket commercial redistribution permission for UGN. This build is technically deployable as a static site, but it is **not certified for monetized public distribution**. Preserve credits and creator links, and acquire explicit commercial permissions or remove affected titles before accepting paid hosting, sponsorships or advertising for the emulator. See CREDITS.md.
