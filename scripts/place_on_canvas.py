"""Pads a small PNG onto a 256×384 transparent canvas at specified coords.

Useful for iterating on item art at icon size and placing it onto the
character canvas without manually editing in an art tool. Supports an
optional integer scale factor (nearest-neighbor, so pixel art stays crisp).

Usage:
    py scripts/place_on_canvas.py <src.png> <out.png> <x> <y> [scale]

Coords are the top-left of where the (scaled) source is pasted on the
256×384 canvas. The character's head center is at x=128.
"""

import os
import sys
from PIL import Image

CANVAS_W, CANVAS_H = 256, 384


def place(src_path: str, out_path: str, x: int, y: int, scale: int = 1) -> None:
    if scale < 1:
        raise ValueError("scale must be >= 1")
    src = Image.open(src_path).convert("RGBA")
    if scale != 1:
        src = src.resize((src.width * scale, src.height * scale), Image.NEAREST)

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    canvas.paste(src, (x, y), src)
    canvas.save(out_path)
    print(f"{out_path}: placed {src.size} at ({x}, {y})")


if __name__ == "__main__":
    if len(sys.argv) < 5:
        print(__doc__)
        sys.exit(1)
    src = sys.argv[1]
    out = sys.argv[2]
    x = int(sys.argv[3])
    y = int(sys.argv[4])
    scale = int(sys.argv[5]) if len(sys.argv) > 5 else 1
    place(src, out, x, y, scale)
