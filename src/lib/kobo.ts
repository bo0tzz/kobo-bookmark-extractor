import type { DB, Sqlite3 } from 'sqlite-wasm-esm';
import { deserializeDatabase } from './database';
import { getFileByPath, getKoboRoot } from './filesystem';

type Kobo = {
	database: DB;
	fsRoot: FileSystemDirectoryHandle;
};

const KOBO_DATA_FOLDER = '.kobo';
const KOBO_DATABASE_FILE = 'KoboReader.sqlite';
const KOBO_KEPUB_FOLDER = 'kepub';

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
