import { error } from '@sveltejs/kit';
import { photos, photosForRoll } from '#lib/photos';
import type { PageLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () =>
	photos.map(({ year, roll, name }) => ({ year, roll, photo: name }));

export const load: PageLoad = ({ params }) => {
	if (!photosForRoll(params.year, params.roll).some((p) => p.name === params.photo)) {
		error(404, 'No such photo');
	}
	return { year: params.year, roll: params.roll, photo: params.photo };
};
