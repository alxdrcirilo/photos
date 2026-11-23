import type { Picture } from 'vite-imagetools';

export type Photo = {
	name: string;
	image: Picture;
	/** YYYYMMDD as written in metadata.csv */
	date: string;
	year: string;
	location: string;
	/** People in the photo, e.g. ["Alice", "Bob"] */
	people: string[];
	/** Film stock of the roll the photo was taken on */
	film: string;
	/** Name of the roll's folder, e.g. 52530_00003644 */
	roll: string;
};

// metadata.csv next to each roll: filename,date,location,people (semicolon-separated)
const csvs = import.meta.glob('/src/lib/assets/photos/**/metadata.csv', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

// format=webp skips the default avif encode, which is by far the slowest part of
// generating these on first request (sources are already webp, so no fallback format needed)
const images = import.meta.glob('/src/lib/assets/photos/**/*.webp', {
	eager: true,
	query: '?enhanced&format=webp',
	import: 'default'
}) as Record<string, Picture>;

// film.txt in each roll folder: the film stock name
const films = import.meta.glob('/src/lib/assets/photos/**/film.txt', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const folderOf = (path: string) => path.slice(0, path.lastIndexOf('/'));
const basename = (path: string) => (path.split('/').pop() ?? '').replace(/\.[^.]+$/, '');

const filmByFolder = new Map(
	Object.entries(films).map(([path, film]) => [folderOf(path), film.trim()])
);

// Keyed by folder as well as filename: two rolls can reuse the same frame numbers
const details = new Map<string, { date: string; location: string; people: string[] }>();
for (const [path, csv] of Object.entries(csvs)) {
	const folder = folderOf(path);
	for (const line of csv.trim().split('\n').slice(1)) {
		// people is always the last column, so pop it off first; the remaining
		// commas (location may itself contain commas) all belong to location
		const [filename, date, ...rest] = line.split(',').map((value) => value.trim());
		const people = (rest.pop() ?? '')
			.split(';')
			.map((person) => person.trim())
			.filter(Boolean);
		details.set(`${folder}/${basename(filename)}`, { date, location: rest.join(', '), people });
	}
}

export const photos: Photo[] = Object.entries(images)
	.flatMap(([path, image]) => {
		const folder = folderOf(path);
		const name = basename(path);
		const detail = details.get(`${folder}/${name}`);
		if (!detail) return [];
		const year = detail.date.slice(0, 4);
		const folderYear = folder.split('/').at(-2);
		// otherwise one mistyped date silently files a photo under a year of its own
		if (year !== folderYear) {
			throw new Error(
				`${path}: metadata.csv date ${detail.date} is not in the ${folderYear} folder`
			);
		}
		return [
			{
				name,
				image,
				date: detail.date,
				year,
				location: detail.location,
				people: detail.people,
				film: filmByFolder.get(folder) ?? '',
				roll: folder.split('/').pop() ?? ''
			}
		];
	})
	.sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

export const years = [...new Set(photos.map((photo) => photo.year))]
	.sort((a, b) => b.localeCompare(a))
	.map((year) => {
		const inYear = photosForYear(year);
		const byRoll = new Map<string, Photo[]>();
		for (const photo of inYear) {
			const group = byRoll.get(photo.roll);
			if (group) group.push(photo);
			else byRoll.set(photo.roll, [photo]);
		}
		// photos is date-sorted and grouping preserves order, so each group runs first -> last
		const rolls = [...byRoll.values()].map((rollPhotos) => ({
			roll: rollPhotos[0].roll,
			film: rollPhotos[0].film,
			count: rollPhotos.length,
			first: rollPhotos[0].date,
			last: rollPhotos[rollPhotos.length - 1].date,
			places: [...new Set(rollPhotos.map((photo) => formatLocation(photo.location)))]
				.sort()
				.join(', ')
		}));
		return { year, count: inYear.length, rolls };
	});

export function photosForYear(year: string) {
	return photos.filter((photo) => photo.year === year);
}

export function photosForRoll(year: string, roll: string) {
	return photos.filter((photo) => photo.year === year && photo.roll === roll);
}

export function filmsForYear(year: string) {
	return [
		...new Set(
			photosForYear(year)
				.map((photo) => photo.film)
				.filter(Boolean)
		)
	];
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 20260907 -> "07 Sep 2026" */
export function formatDate(date: string) {
	const day = date.slice(6, 8);
	const month = months[Number(date.slice(4, 6)) - 1];
	return `${day} ${month} ${date.slice(0, 4)}`;
}

/** 20260926, 20261017 -> "26 Sep 2026 – 17 Oct 2026" (single day if equal) */
export function formatDateRange(first: string, last: string) {
	return first === last ? formatDate(first) : `${formatDate(first)} – ${formatDate(last)}`;
}

/** "rotterdam" -> "Rotterdam" */
export function formatLocation(location: string) {
	return location.charAt(0).toUpperCase() + location.slice(1);
}

/** ["alex", "jamie"] -> "Alex, Jamie" */
export function formatPeople(people: string[]) {
	return people.map((person) => person.charAt(0).toUpperCase() + person.slice(1)).join(', ');
}
