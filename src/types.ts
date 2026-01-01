export type FileSystemItem = {
	id: string;
	name: string;
	type: "file" | "folder";
	children?: FileSystemItem[]; // Only folders have children
	isOpen?: boolean; // Only folders need this
	parentId?: string | null; // null = root
};
