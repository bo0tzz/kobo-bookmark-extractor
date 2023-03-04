import { BlobReader, ZipReader, type Entry } from '@zip.js/zip.js';

export const toZipReader = async (handle: FileSystemFileHandle): Promise<ZipReader<unknown>> => {
	const file = await handle.getFile();
	const fileBlob = new BlobReader(file);
	const zipReader = new ZipReader(fileBlob);
	return zipReader;
};

export const getFirstFileMatch = async (
	zip: ZipReader<unknown>,
	regex: RegExp
): Promise<Entry | null> => {
	for (const entry of await zip.getEntries()) {
		const match = regex.exec(entry.filename);
		if (match) {
			return entry;
		}
	}
	return null;
};
