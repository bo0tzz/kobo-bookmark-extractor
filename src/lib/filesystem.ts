export const getFileByPath = async (
	root: FileSystemDirectoryHandle,
	path: string[]
): Promise<FileSystemFileHandle> => {
	const [head, ...rest] = path;
	if (rest.length == 0) {
		const handle = await root.getFileHandle(head);
		return handle;
	} else {
		const dir = await root.getDirectoryHandle(head);
		return await getFileByPath(dir, rest);
	}
};

export const getKoboRoot = async (): Promise<FileSystemDirectoryHandle> => {
	const handle = await window.showDirectoryPicker({ id: 'kobo-root' });
	return handle;
};
