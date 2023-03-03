import type { DB } from 'sqlite-wasm-esm';
import sqlite3InitModule from 'sqlite-wasm-esm';

export const deserializeDatabase = async (buf: Uint8Array): Promise<DB> => {
	const sqlite3 = await sqlite3InitModule();

	// HACK: If the WAL flags are set, deserialization won't work
	buf[18] = 1;
	buf[19] = 1;

	const p = sqlite3.wasm.allocFromTypedArray(buf);
	const db = new sqlite3.oo1.DB();
	const rc = sqlite3.capi.sqlite3_deserialize(
		db.pointer,
		'main',
		p,
		buf.byteLength,
		buf.byteLength,
		sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE
	);

	return db;
};

export const query = async (db: DB, query: string): Promise<object[]> => {
	const res = db.exec(query, { returnValue: 'resultRows', rowMode: 'object' });
	return res;
};
