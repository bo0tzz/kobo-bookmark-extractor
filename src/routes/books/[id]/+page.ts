import { books } from '$lib/stores/local-storage';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
	const book = get(books)[decodeURIComponent(params.id)];

	if (!book) {
		throw error(404);
	}

	return {
		book,
		meta: {
			title: `${book.title} - ${book.author}`
		}
	};
}) satisfies PageLoad;
