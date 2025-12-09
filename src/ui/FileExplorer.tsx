import React, { useState } from "react";
import styles from "./FileExplorer.module.css";

// --- Types ---
type FileType = "folder" | "file" | "image" | "pdf";

interface FileNode {
	id: string;
	name: string;
	type: FileType;
	children?: FileNode[]; // Only for folders
	isOpen?: boolean; // UI state for folders
}

// --- Icons (Inline SVGs for immediate usage) ---
const ChevronRight = () => (
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="9 18 15 12 9 6"></polyline>
	</svg>
);

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => (
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 24 24"
		fill={isOpen ? "currentColor" : "none"}
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
	</svg>
);

const FileIcon = ({ type }: { type: FileType }) => {
	if (type === "pdf")
		return (
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14 2 14 8 20 8"></polyline>
				<path d="M9 13v-1h6v1"></path>
				<path d="M12 18v-6"></path>
			</svg>
		);
	if (type === "image")
		return (
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
				<circle cx="8.5" cy="8.5" r="1.5"></circle>
				<polyline points="21 15 16 10 5 21"></polyline>
			</svg>
		);
	return (
		<svg
			width="100%"
			height="100%"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
			<polyline points="13 2 13 9 20 9"></polyline>
		</svg>
	);
};

const AddFileIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
		<polyline points="14 2 14 8 20 8"></polyline>
		<line x1="12" y1="18" x2="12" y2="12"></line>
		<line x1="9" y1="15" x2="15" y2="15"></line>
	</svg>
);
const AddFolderIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
		<line x1="12" y1="11" x2="12" y2="17"></line>
		<line x1="9" y1="14" x2="15" y2="14"></line>
	</svg>
);

// --- Initial Mock Data (Matching your screenshot) ---
const initialData: FileNode = {
	id: "root",
	name: "Code Base",
	type: "folder",
	isOpen: true,
	children: [
		{
			id: "1",
			name: "Code Base",
			type: "folder",
			children: [],
		},
		{
			id: "2",
			name: "Resources",
			type: "folder",
			children: [],
		},
		{
			id: "3",
			name: "documentation.pdf",
			type: "pdf",
		},
		{
			id: "4",
			name: "design.png",
			type: "image",
		},
	],
};

// --- Recursive Node Component ---
const FileNodeItem: React.FC<{
	node: FileNode;
	depth: number;
	onToggle: (id: string) => void;
	onAdd: (parentId: string, type: "file" | "folder", name: string) => void;
}> = ({ node, depth, onToggle, onAdd }) => {
	const handleAdd = (e: React.MouseEvent, type: "file" | "folder") => {
		e.stopPropagation();
		// For demo simplicity, using prompt. In production, use an inline input field.
		const name = window.prompt(`Enter name for new ${type}:`);
		if (name) onAdd(node.id, type, name);
	};

	const getIconClass = (type: FileType) => {
		switch (type) {
			case "pdf":
				return styles.pdfIcon;
			case "image":
				return styles.imgIcon;
			case "folder":
				return styles.folderIcon;
			default:
				return styles.fileIcon;
		}
	};

	return (
		<div>
			<div
				className={styles.nodeRow}
				style={{ paddingLeft: `${depth * 12 + 8}px` }} // Dynamic indent
				onClick={() => node.type === "folder" && onToggle(node.id)}
			>
				<div className={styles.nodeContent}>
					{/* Chevron for Folders */}
					{node.type === "folder" && (
						<span
							className={`${styles.chevron} ${
								node.isOpen ? styles.open : ""
							}`}
						>
							<ChevronRight />
						</span>
					)}
					{/* Spacer for files to align with folders */}
					{node.type !== "folder" && <span style={{ width: 14 }} />}

					{/* Main Icon */}
					<span
						className={`${styles.icon} ${getIconClass(node.type)}`}
					>
						{node.type === "folder" ? (
							<FolderIcon isOpen={!!node.isOpen} />
						) : (
							<FileIcon type={node.type} />
						)}
					</span>

					<span className={styles.nodeText}>{node.name}</span>
				</div>

				{/* Hover Actions (Only for folders) */}
				{node.type === "folder" && (
					<div className={styles.actions}>
						<button
							className={styles.actionBtn}
							onClick={(e) => handleAdd(e, "file")}
							title="New File"
						>
							<AddFileIcon />
						</button>
						<button
							className={styles.actionBtn}
							onClick={(e) => handleAdd(e, "folder")}
							title="New Folder"
						>
							<AddFolderIcon />
						</button>
					</div>
				)}
			</div>

			{/* Children */}
			{node.isOpen &&
				node.children &&
				node.children.map((child) => (
					<FileNodeItem
						key={child.id}
						node={child}
						depth={depth + 1}
						onToggle={onToggle}
						onAdd={onAdd}
					/>
				))}
		</div>
	);
};

// --- Main Explorer Component ---
export const FileExplorer: React.FC = () => {
	const [data, setData] = useState<FileNode>(initialData);

	// Helper to deep update tree
	const updateTree = (
		nodes: FileNode,
		targetId: string,
		updateFn: (node: FileNode) => FileNode
	): FileNode => {
		if (nodes.id === targetId) {
			return updateFn(nodes);
		}
		if (nodes.children) {
			return {
				...nodes,
				children: nodes.children.map((child) =>
					updateTree(child, targetId, updateFn)
				),
			};
		}
		return nodes;
	};

	const toggleFolder = (id: string) => {
		setData((prev) =>
			updateTree(prev, id, (node) => ({ ...node, isOpen: !node.isOpen }))
		);
	};

	const addItem = (
		parentId: string,
		type: "file" | "folder",
		name: string
	) => {
		const newItem: FileNode = {
			id: Date.now().toString(),
			name,
			type:
				type === "folder"
					? "folder"
					: name.endsWith(".pdf")
					? "pdf"
					: name.endsWith(".png")
					? "image"
					: "file",
			children: type === "folder" ? [] : undefined,
			isOpen: true,
		};

		setData((prev) =>
			updateTree(prev, parentId, (node) => ({
				...node,
				isOpen: true, // Auto open parent
				children: [...(node.children || []), newItem].sort((a, b) => {
					// Sort: Folders first, then files
					if (a.type === "folder" && b.type !== "folder") return -1;
					if (a.type !== "folder" && b.type === "folder") return 1;
					return a.name.localeCompare(b.name);
				}),
			}))
		);
	};

	return (
		<div className={styles.explorerContainer}>
			<FileNodeItem
				node={data}
				depth={0}
				onToggle={toggleFolder}
				onAdd={addItem}
			/>
		</div>
	);
};
