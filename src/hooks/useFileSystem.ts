import { useState, useCallback } from "react";
import { type FileSystemItem } from "@/types";

export const useFileSystem = (initial: FileSystemItem[]) => {
	const [items, setItems] = useState<FileSystemItem[]>(initial);

	// ------------------------------------------------------------
	// Helper: Remove any item (file or folder) and return:
	// 1) cleanTree (tree without item)
	// 2) removedItem (the item itself)
	// ------------------------------------------------------------
	const removeItem = (list: FileSystemItem[], id: string) => {
		let removed: FileSystemItem | null = null;

		// Search root level first
		const rootFiltered = list.filter((item) => {
			if (item.id === id) {
				removed = item;
				return false;
			}
			return true;
		});

		if (removed) return { cleanTree: rootFiltered, removedItem: removed };

		// Not in root → check inside folders
		const newTree = rootFiltered.map((folder) => {
			if (folder.type === "folder" && folder.children) {
				const filteredChildren = folder.children.filter((child) => {
					if (child.id === id) {
						removed = child;
						return false;
					}
					return true;
				});
				return { ...folder, children: filteredChildren };
			}
			return folder;
		});

		return { cleanTree: newTree, removedItem: removed };
	};

	// ------------------------------------------------------------
	// Toggle folder open/close
	// ------------------------------------------------------------
	const toggleFolder = useCallback((id: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, isOpen: !item.isOpen } : item
			)
		);
	}, []);

	// ------------------------------------------------------------
	// Delete item (safe, 2-level only)
	// ------------------------------------------------------------
	const deleteItem = useCallback((id: string) => {
		setItems((prev) => {
			const { cleanTree } = removeItem(prev, id);
			return cleanTree;
		});
	}, []);

	// ------------------------------------------------------------
	// Move item: into-folder | reorder | to-root
	// ------------------------------------------------------------
	const moveItem = useCallback(
		(
			dragId: string,
			targetId: string | null,
			action: "into-folder" | "reorder" | "to-root"
		) => {
			setItems((prev) => {
				// Remove dragged item first
				const { cleanTree, removedItem } = removeItem(prev, dragId);
				if (!removedItem) return prev;

				// ---- INTO FOLDER ----
				if (action === "into-folder" && targetId) {
					// target must be folder
					return cleanTree.map((f) => {
						if (f.id === targetId && f.type === "folder") {
							// folders cannot go into folders
							if (removedItem.type === "folder") return f;

							return {
								...f,
								isOpen: true,
								children: [...(f.children ?? []), removedItem],
							};
						}
						return f;
					});
				}

				// ---- MOVE TO ROOT ----
				if (action === "to-root") {
					return [...cleanTree, removedItem];
				}

				// ---- REORDER ----
				if (action === "reorder" && targetId) {
					// 1) Check if reorder happens in ROOT
					const rootIdx = cleanTree.findIndex(
						(i) => i.id === targetId
					);
					if (rootIdx !== -1) {
						const newList = [...cleanTree];
						newList.splice(rootIdx + 1, 0, removedItem);
						return newList;
					}

					// 2) Otherwise reorder inside a folder
					return cleanTree.map((f) => {
						if (f.type === "folder" && f.children) {
							const idx = f.children.findIndex(
								(c) => c.id === targetId
							);
							if (idx !== -1) {
								const arr = [...f.children];
								arr.splice(idx + 1, 0, removedItem);
								return { ...f, children: arr };
							}
						}
						return f;
					});
				}

				return prev;
			});
		},
		[]
	);

	// ------------------------------------------------------------
	// Create folder then move file into it (root-level only)
	// ------------------------------------------------------------
	const createFolderAndMove = useCallback(
		(fileId: string, name: string, isNew: boolean) => {
			setItems((prev) => {
				const { cleanTree, removedItem } = removeItem(prev, fileId);
				if (!removedItem) return prev;

				if (isNew) {
					const newFolder: FileSystemItem = {
						id: `folder-${Date.now()}`,
						name,
						type: "folder",
						isOpen: true,
						children: [removedItem],
					};
					return [...cleanTree, newFolder];
				}

				// Add into existing folder (root level only)
				return cleanTree.map((f) => {
					if (f.type === "folder" && f.name === name) {
						return {
							...f,
							isOpen: true,
							children: [...(f.children ?? []), removedItem],
						};
					}
					return f;
				});
			});
		},
		[]
	);

	return { items, toggleFolder, deleteItem, moveItem, createFolderAndMove };
};
