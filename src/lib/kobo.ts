import { Data64URIWriter } from '@zip.js/zip.js';
import mime from 'mime';
import type { DB } from 'sqlite-wasm-esm';
import { deserializeDatabase, query } from './database';
import { getFileByPath, getKoboRoot } from './filesystem';
import { books } from './stores/local-storage';
import { getFirstFileMatch, toZipReader } from './zip';

export type Bookmark = {
	id: string;
	text: string;
};

export type Book = {
	id: string;
	title: string;
	author: string;
	bookmarks: Bookmark[];
	cover: string | null;
};

const KOBO_DATA_FOLDER = '.kobo';
const KOBO_DATABASE_FILE = 'KoboReader.sqlite';
const KOBO_KEPUB_FOLDER = 'kepub';

export const importKobo = async () => {
	const { database, fsRoot } = await loadKoboDatabase();

	const bookmarkedBooks = await getBookmarkedBooks(database);

	books.set({});
	for (const b of bookmarkedBooks) {
		const id = b.ContentID;

		const bookmarks = (await getBookmarks(database, id)).map((bookmark) => {
			return {
				id: bookmark.BookmarkID,
				text: bookmark.Text
			};
		});

		const cover = await getCoverImage(fsRoot, id);

		let author = b.Attribution;
		let title = b.Title;

		if (author == 'Unknown') {
			[title, author] = title.split('_');
		}

		const book: Book = {
			id,
			title,
			author,
			bookmarks,
			cover
		};

		books.update((b) => {
			b[id] = book;
			return b;
		});
	}
};

export const loadKoboDatabase = async () => {
	const root = await getKoboRoot();
	const dbFileHandle = await getFileByPath(root, [KOBO_DATA_FOLDER, KOBO_DATABASE_FILE]);
	const dbFile = await dbFileHandle.getFile();
	const buf = new Uint8Array(await dbFile.arrayBuffer());

	const db = await deserializeDatabase(buf);

	return {
		database: db,
		fsRoot: root
	};
};

type BookQueryResult = {
	ContentID: string;
	Title: string;
	Attribution: string;
};

type BookmarksQueryResult = {
	BookmarkID: string;
	Text: string;
};

const getBookmarkedBooks = async (database: DB): Promise<BookQueryResult[]> => {
	const q =
		'select ContentID, Title, Attribution from content where ContentId in (select distinct VolumeId from Bookmark) and ContentType = 6;';
	return (await query(database, q)) as BookQueryResult[];
};

const getBookmarks = async (database: DB, bookId: string): Promise<BookmarksQueryResult[]> => {
	const q = `select BookmarkID, Text from Bookmark where VolumeId = '${bookId}';`;
	return (await query(database, q)) as BookmarksQueryResult[];
};

const COVER_REGEX = /cover.(jpe?g|png)$/;

const getCoverImage = async (fsRoot: FileSystemDirectoryHandle, bookId: string) => {
	try {
		const zipFile = await getFileByPath(fsRoot, [KOBO_DATA_FOLDER, KOBO_KEPUB_FOLDER, bookId]);
		const reader = await toZipReader(zipFile);
		const coverEntry = await getFirstFileMatch(reader, COVER_REGEX);
		if (!coverEntry) return null;

		const type = mime.getType(coverEntry.filename);
		if (!type) return null;

		const writer = new Data64URIWriter(type);
		const dataUri = await coverEntry.getData(writer);
		return dataUri;
	} catch (e) {
		console.error(e);
		return null;
	}
};
