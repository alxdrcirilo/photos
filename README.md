# Photos

A static gallery of my film photos, built with SvelteKit and deployed to GitHub Pages.

## Adding a roll

Drop a folder under `src/lib/assets/photos/<year>/<roll>/` containing:

- the scans as `.webp`, named with their original filenames (JPEGs are ignored; convert them first, below)
- `film.txt`: the film stock name, one line
- `metadata.csv`: `filename,date,location` with a header row, one row per photo (`date` as `YYYYMMDD`, and `location` may contain commas)

Every `date` must fall in the `<year>` folder the roll sits in; the build fails loudly if one does not.

JPEG scans need converting to WebP first:

```sh
python scripts/jpeg_to_webp.py src/lib/assets/photos
```

This resizes to a 3000px long edge, strips EXIF, and bakes in rotation. Requires `pip install pillow tqdm`.

## Developing

```sh
bun install
bun run dev
```

## Building

```sh
bun run build
```

Prerenders the whole site (every route is static) into `build/`, which GitHub Actions deploys to GitHub Pages on push to `main` (see `.github/workflows/deploy.yaml`).

## Other scripts

```sh
bun run check   # svelte-check
bun run lint    # prettier --check + eslint
bun run format  # prettier --write
```
