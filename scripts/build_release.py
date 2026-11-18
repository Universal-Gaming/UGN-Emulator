#!/usr/bin/env python3
"""Build an upload-ready static UGN Emulator release, with provenance and file hashes."""
import hashlib, json, sys, zipfile
from pathlib import Path
ROOT=Path(".")
roms=sorted(p for p in Path("roms").rglob("*") if p.is_file())
hosted=json.loads(Path("catalog/hosted.json").read_text(encoding="utf-8"))
expected={(item["path"], item["bytes"]) for item in hosted["games"]}
actual={(p.as_posix(),p.stat().st_size) for p in roms}
if len(roms)!=79 or expected!=actual:
    raise SystemExit(f"Release blocked: ROM manifest mismatch (have {len(roms)}, expected 79)")
paths=[]
for pattern in ("*.html","*.js","*.css","*.svg","assets/**/*","catalog/**/*","roms/**/*","licenses/**/*"):
    paths.extend(p for p in ROOT.glob(pattern) if p.is_file())
for name in (".nojekyll","CREDITS.md","HOSTING.md"):
    if not Path(name).is_file(): raise SystemExit("Release blocked: missing "+name)
    paths.append(Path(name))
paths=sorted(set(paths),key=lambda p:p.as_posix())
for must in ("index.html","library.html","app.js","artwork.js","catalog/hosted.json"):
    if Path(must) not in paths:raise SystemExit("Release blocked: missing "+must)
for html in ("index.html","library.html"):
    import re,urllib.parse
    body=Path(html).read_text(encoding="utf-8")
    for href in re.findall(r'(?:href|src)=["\'](\./[^"\']+)["\']',body):
        relative=urllib.parse.unquote(href[2:].split("?")[0].split("#")[0])
        if not Path(relative).is_file():raise SystemExit(f"Broken local asset in {html}: {href}")
out=Path("UGN-Emulator-Hosting.zip")
manifest=["# SHA-256 checksums for the exact files in this hosting ZIP",""]
with zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for p in paths:
        data=p.read_bytes()
        archive.writestr(p.as_posix(),data,compress_type=zipfile.ZIP_DEFLATED)
        manifest.append(hashlib.sha256(data).hexdigest()+"  "+p.as_posix())
    archive.writestr("RELEASE-SHA256.txt","\n".join(manifest)+"\n")
with zipfile.ZipFile(out) as archive:
    broken=archive.testzip()
    if broken:raise SystemExit("ZIP corruption: "+broken)
    names=set(archive.namelist())
    if not {"index.html","library.html","catalog/hosted.json","RELEASE-SHA256.txt"}.issubset(names):
        raise SystemExit("Missing release entries")
    if len([x for x in names if x.startswith("roms/")])!=79:raise SystemExit("Not all 79 ROMs in ZIP")
print("PASS: Hosting ZIP validated",len(paths),"files",len(roms),"real ROMs",out.stat().st_size,"bytes")
