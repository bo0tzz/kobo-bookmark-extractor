import { persisted } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';

export type Bookmark = {
	id: string;
	text: string;
};

export type Book = {
	id: string;
	title: string;
	author: string;
	bookmarks: Bookmark[];
};

export const books: Writable<Record<string, Book>> = persisted('kobo-books', {});
