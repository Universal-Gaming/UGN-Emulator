#!/usr/bin/env python3
"""Create a title-only, use-your-own-copy console catalog from Libretro DAT metadata.

The output contains game names/regions and no ROM data, BIOS data, or file links to
copyrighted games. It is not an offer to download commercial ROMs.

Libretro database metadata: CC BY-SA 4.0:
https://github.com/libretro/libretro-database/blob/master/LICENSE
"""
from __future__ import annotations
import json
import re
import urllib.request
from pathlib import Path
from urllib.parse import quote

SOURCE = "https://raw.githubusercontent.com/libretro/libretro-database/master/"
SYSTEMS = {
  "nes": ("metadat/no-intro/Nintendo - Nintendo Entertainment System.dat", "Nintendo - Nintendo Entertainment System"),
  "snes": ("metadat/no-intro/Nintendo - Super Nintendo Entertainment System.dat", "Nintendo - Super Nintendo Entertainment System"),
  "n64": ("metadat/no-intro/Nintendo - Nintendo 64.dat", "Nintendo - Nintendo 64"),
  "gb": ("metadat/no-intro/Nintendo - Game Boy.dat", "Nintendo - Game Boy"),
  "gbc": ("metadat/no-intro/Nintendo - Game Boy Color.dat", "Nintendo - Game Boy Color"),
  "gba": ("metadat/no-intro/Nintendo - Game Boy Advance.dat", "Nintendo - Game Boy Advance"),
  "nds": ("metadat/no-intro/Nintendo - Nintendo DS.dat", "Nintendo - Nintendo DS"),
  "segaMD": ("metadat/no-intro/Sega - Mega Drive - Genesis.dat", "Sega - Mega Drive - Genesis"),
  "segaGG": ("metadat/no-intro/Sega - Game Gear.dat", "Sega - Game Gear"),
  "sega32x": ("metadat/no-intro/Sega - 32X.dat", "Sega - 32X"),
  "segaCD": ("metadat/redump/Sega - Mega-CD - Sega CD.dat", "Sega - Mega-CD - Sega CD"),
  "segaSaturn": ("metadat/redump/Sega - Saturn.dat", "Sega - Saturn"),
  "psx": ("metadat/redump/Sony - PlayStation.dat", "Sony - PlayStation"),
  "atari2600": ("metadat/no-intro/Atari - 2600.dat", "Atari - 2600"),
  "ngp": ("metadat/no-intro/SNK - Neo Geo Pocket.dat", "SNK - Neo Geo Pocket"),
  "neogeo": ("dat/SNK - Neo Geo.dat", "SNK - Neo Geo"),
}

OUT = Path("catalog/byo")
OUT.mkdir(parents=True, exist_ok=True)
PATTERN = re.compile(r'(?m)^game\s*\(\s*\n\s*name\s+"([^"]+)"')
REGION = re.compile(r"\((USA|World|Europe|Japan|Asia|Brazil|Australia|Korea|China|Taiwan|Canada|Germany|France|Spain|Italy|Sweden|Russia)(?:[, )])")
REJECT = re.compile(r"\((Beta|Proto|BIOS|Test Program|Test Cart|Demo|Sample|Trainer|Pirate|Unl|Rev [A-Z]|Virtual Console|Aftermarket)\)", re.I)

def get_text(location: str) -> str:
  url = SOURCE + quote(location, safe="/")
  request = urllib.request.Request(url, headers={"User-Agent": "UGN-Emulator/1.0 (metadata only)"})
  with urllib.request.urlopen(request, timeout=60) as response:
    return response.read().decode("utf-8", errors="replace")

def main():
  manifest = {"generated_from": "libretro/libretro-database", "license": "CC-BY-SA-4.0",
              "source": "https://github.com/libretro/libretro-database", "systems": [], "total": 0}
  for system, (source_file, playlist) in SYSTEMS.items():
    print("Retrieving", system, source_file, flush=True)
    raw = get_text(source_file)
    names = PATTERN.findall(raw)
    if not names:
      raise RuntimeError("No game names parsed for " + system)
    seen = set()
    entries = []
    for n in names:
      n = n.strip()
      if not n or len(n) > 220 or REJECT.search(n):
        continue
      key = n.casefold()
      if key in seen:
        continue
      seen.add(key)
      region = REGION.search(n)
      entries.append([n, region.group(1) if region else ""])
    entries.sort(key=lambda x: x[0].casefold())
    path = OUT / f"{system}.json"
    path.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    manifest["systems"].append({"id": system, "name": playlist, "count": len(entries),
                                "file": "catalog/byo/" + system + ".json"})
    manifest["total"] += len(entries)
    print(system, len(entries), "titles; raw", len(names), "entries", flush=True)
  Path("catalog/manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
  print("Catalog includes", manifest["total"], "title/edition entries across", len(SYSTEMS), "systems")

if __name__ == "__main__":
  main()
