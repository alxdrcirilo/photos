import { error } from '@sveltejs/kit';
import { years } from '#lib/photos';
import type { PageLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => years.map(({ year }) => ({ year }));

export const load: PageLoad = ({ params }) => {
	if (!years.some((y) => y.year === params.year)) {
		error(404, 'No photos for this year');
	}
	return { year: params.year };
};
