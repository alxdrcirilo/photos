#!/usr/bin/env python3
"""Convert JPEG scans to WebP in place, mirroring the existing folder structure.

Requires Pillow and tqdm: pip install pillow tqdm

Usage:
    python scripts/jpeg_to_webp.py src/lib/assets/photos
    python scripts/jpeg_to_webp.py src/lib/assets/photos --max-size 4000
    python scripts/jpeg_to_webp.py --self-test
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageOps
from tqdm import tqdm

QUALITY = 82
METHOD = 6  # slower encode, better compression; fine for a one-off batch job


def human_size(num_bytes: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if num_bytes < 1024:
            return f"{num_bytes:.1f}{unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f}TB"


def convert(src: Path, max_size: int) -> None:
    dest = src.with_suffix(".webp")
    if dest.exists():
        tqdm.write(f"skip (exists): {dest}")
        return
    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img)  # bake in rotation before EXIF is dropped
        img = img.convert("RGB")
        img.thumbnail((max_size, max_size), Image.LANCZOS)
        img.save(
            dest, "WEBP", quality=QUALITY, method=METHOD
        )  # no exif= -> EXIF stripped
    before, after = src.stat().st_size, dest.stat().st_size
    pct = (1 - after / before) * 100 if before else 0
    tqdm.write(f"{src} -> {dest}  {human_size(before)} -> {human_size(after)} (-{pct:.0f}%)")


def self_test() -> None:
    import tempfile

    with tempfile.TemporaryDirectory() as tmp_str:
        tmp = Path(tmp_str)
        src = tmp / "sub" / "test.jpg"
        src.parent.mkdir()

        img = Image.new("RGB", (4000, 2000), "red")
        exif = Image.Exif()
        exif[274] = 6  # Orientation: rotate 90
        img.save(src, "JPEG", exif=exif)

        convert(src, max_size=1000)

        dest = src.with_suffix(".webp")
        assert dest.exists(), "webp not written"
        with Image.open(dest) as out:
            assert out.format == "WEBP"
            assert max(out.size) <= 1000, f"not resized: {out.size}"
            assert out.size[1] > out.size[0], f"orientation not applied: {out.size}"
            assert not out.info.get("exif"), "exif not stripped"
        assert src.exists(), "original was deleted"

    print("self-test passed")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "root",
        type=Path,
        nargs="?",
        help="Folder to search recursively for .jpg/.jpeg files",
    )
    parser.add_argument(
        "--max-size",
        type=int,
        default=3000,
        help="Cap the long edge in pixels (default: 3000)",
    )
    parser.add_argument(
        "--self-test", action="store_true", help="Run a self-check and exit"
    )
    args = parser.parse_args()

    if args.self_test:
        self_test()
        return

    if not args.root:
        parser.error("root is required unless --self-test is given")
    if not args.root.is_dir():
        sys.exit(f"not a directory: {args.root}")

    jpegs = sorted(
        p for p in args.root.rglob("*") if p.suffix.lower() in (".jpg", ".jpeg")
    )
    if not jpegs:
        sys.exit(f"no JPEGs found under {args.root}")

    for jpeg in tqdm(jpegs, unit="img"):
        convert(jpeg, args.max_size)


if __name__ == "__main__":
    main()
