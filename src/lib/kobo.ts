import type { DB, Sqlite3 } from 'sqlite-wasm-esm';
import { deserializeDatabase, query } from './database';
import { getFileByPath, getKoboRoot } from './filesystem';
import { books } from './stores/local-storage';

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

const KOBO_DATA_FOLDER = '.kobo';
const KOBO_DATABASE_FILE = 'KoboReader.sqlite';
const KOBO_KEPUB_FOLDER = 'kepub';

export const importKobo = async () => {
	const { database, fsRoot } = await loadKoboDatabase();

	const bookmarkedBooks = await getBookmarkedBooks(database);

	const bookMap: Record<string, Book> = {};
	for (const b of bookmarkedBooks) {
		const bookmarks = (await getBookmarks(database, b.ContentID)).map((bookmark) => {
			return {
				id: bookmark.BookmarkID,
				text: bookmark.Text
			};
		});

		let author = b.Attribution;
		let title = b.Title;

		if (author == 'Unknown') {
			[title, author] = title.split('_');
		}

		const book = {
			id: b.ContentID,
			title,
			author,
			bookmarks
		};

		bookMap[book.id] = book;
	}

	books.set(bookMap);
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

export const getBookmarkedBooks = async (database: DB): Promise<BookQueryResult[]> => {
	const q =
		'select ContentID, Title, Attribution from content where ContentId in (select distinct VolumeId from Bookmark) and ContentType = 6;';
	return (await query(database, q)) as BookQueryResult[];
};

export const getBookmarks = async (
	database: DB,
	bookId: string
): Promise<BookmarksQueryResult[]> => {
	const q = `select BookmarkID, Text from Bookmark where VolumeId = '${bookId}';`;
	return (await query(database, q)) as BookmarksQueryResult[];
};
