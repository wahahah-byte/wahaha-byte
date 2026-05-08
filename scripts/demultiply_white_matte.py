"""One-off cleanup: removes the white-matte halo on PNG alpha edges.

Many art tools export PNGs with the visible RGB pre-composited against a
white background even though the alpha channel is correct. When the image
is later layered on a colored background, those edge pixels read as a
faint white outline. This script reverses the composition pixel-by-pixel:

    composed_c = src_c * (a/255) + 255 * (1 - a/255)
    src_c     = 255 + (composed_c - 255) * (255 / a)

Run from the repo root:  py scripts/demultiply_white_matte.py public/avatars/base.png
A `.original.png` backup is created next to the source on first run.
"""

import os
import sys
from PIL import Image


def fix(path: str) -> None:
    base, _ext = os.path.splitext(path)
    backup = base + ".original.png"
    if not os.path.exists(backup):
        Image.open(path).save(backup)
        print(f"Backup written: {backup}")

    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if 0 < a < 255:
                ratio = 255.0 / a
                nr = max(0, min(255, int(round(255 + (r - 255) * ratio))))
                ng = max(0, min(255, int(round(255 + (g - 255) * ratio))))
                nb = max(0, min(255, int(round(255 + (b - 255) * ratio))))
                if (nr, ng, nb) != (r, g, b):
                    pixels[x, y] = (nr, ng, nb, a)
                    changed += 1

    img.save(path)
    print(f"{path}: rewrote {changed} edge pixels")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: py scripts/demultiply_white_matte.py <png-path> [<png-path>...]")
        sys.exit(1)
    for p in sys.argv[1:]:
        fix(p)
