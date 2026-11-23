import { error } from '@sveltejs/kit';
import { years } from '#lib/photos';
import type { PageLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () =>
	years.flatMap(({ year, rolls }) => rolls.map(({ roll }) => ({ year, roll })));

export const load: PageLoad = ({ params }) => {
	const roll = years.find((y) => y.year === params.year)?.rolls.find((r) => r.roll === params.roll);
	if (!roll) {
		error(404, 'No photos for this roll');
	}
	return { year: params.year, ...roll };
};
