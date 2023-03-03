import type { DB, Sqlite3 } from 'sqlite-wasm-esm';
import { deserializeDatabase, query } from './database';
import { getFileByPath, getKoboRoot } from './filesystem';

export type Kobo = {
	database: DB;
	fsRoot: FileSystemDirectoryHandle;
};

export type Book = {
	BookID: string;
	BookTitle: string;
};

const KOBO_DATA_FOLDER = '.kobo';
const KOBO_DATABASE_FILE = 'KoboReader.sqlite';
const KOBO_KEPUB_FOLDER = 'kepub';

const QUERIES = {
	BOOKMARKED_BOOKS:
		'select BookID, BookTitle from content where BookId in (select distinct VolumeId from Bookmark) and VolumeIndex = 0 and ContentType = 9;'
};

export const loadKoboDatabase = async (): Promise<Kobo> => {
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

export const getBookmarkedBooks = async (kobo: Kobo): Promise<Book[]> => {
	const res = (await query(kobo.database, QUERIES.BOOKMARKED_BOOKS)) as Book[];
	console.log('Got books');
	console.log(res);
	return res;
};
