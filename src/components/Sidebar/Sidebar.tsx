import React, { useState, useRef } from "react";
import styles from "./Sidebar.module.css";
import classNames from "classnames";

// UI Components
import IconButton from "@/ui/IconButton";
import ProjectButton from "@/ui/ProjectButton";
import Folder from "@/ui/Folder";

// Sub-UI / Dialogs
import ProjectOptionsMenu, {
	type MenuAction,
} from "@/ui/subui/ProjectOptionsMenu";
import DeleteConfirmDialog from "@/ui/subui/DeleteConfirmDialog";
import MoveToFolderDialog from "@/ui/subui/MoveToFolderDialog";

// Assets
import newProjectIcon from "@/assets/new_project/new_project.svg";
import newProjectFillIcon from "@/assets/new_project/new_project_fill.svg";
import VerticalDotsIcon from "@/assets/menu/vertical_dots.svg";
import VerticalLineIcon from "@/assets/menu/vertical_lines.svg";
import NewFolderIcon from "@/assets/new_folder/new_folder.svg";
import NewFolderFillIcon from "@/assets/new_folder/new_folder_fill.svg";
import SearchIcon from "@/assets/search/search.svg";
import SettingsIcon from "@/assets/settings/settings.svg";
import SettingsFillIcon from "@/assets/settings/settings_fill.svg";
import ApertureLogo from "@/assets/aperture_logo.svg";
import RenameInput from "@/ui/subui/RenameInput";

// Types
import { type FileSystemItem } from "@/types";

export const Sidebar: React.FC = () => {
	const [renamingId, setRenamingId] = useState<string | null>(null);
	// --- State: UI Layout ---
	const [isCollapsed, setIsCollapsed] = useState(false);

	// --- State: File System Data ---
	const [items, setItems] = useState<FileSystemItem[]>([
		// Mock Data
		{
			id: "1",
			name: "UmagineTN 2026 iTNT Hub",
			type: "file",
			parentId: null,
		},
		{
			id: "folder-1",
			name: "Documentation",
			type: "folder",
			isOpen: true,
			parentId: null,
			children: [
				{
					id: "2",
					name: "Technical rewriting",
					type: "file",
					parentId: "folder-1",
				},
				{
					id: "3",
					name: "Doc Analysis",
					type: "file",
					parentId: "folder-1",
				},
			],
		},
		{
			id: "4",
			name: "Health Monitoring System",
			type: "file",
			parentId: null,
		},
		{
			id: "folder-2",
			name: "Archives",
			type: "folder",
			isOpen: false,
			parentId: null,
			children: [],
		},
	]);

	// --- State: Drag & Drop ---
	const [draggedItem, setDraggedItem] = useState<FileSystemItem | null>(null);

	// --- State: Menus & Modals ---
	const [activeMenu, setActiveMenu] = useState<{
		id: string;
		x: number;
		y: number;
	} | null>(null);
	const [itemToDelete, setItemToDelete] = useState<FileSystemItem | null>(
		null
	);
	const [itemToMove, setItemToMove] = useState<FileSystemItem | null>(null);

	const toggleSidebar = () => setIsCollapsed(!isCollapsed);

	// --- Logic: Folder Toggling ---
	const handleToggleFolder = (folderId: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === folderId ? { ...item, isOpen: !item.isOpen } : item
			)
		);
	};

	// --- Logic: Drag & Drop ---
	const handleDragStart = (e: React.DragEvent, item: FileSystemItem) => {
		setDraggedItem(item);
		e.dataTransfer.effectAllowed = "move";
		// Ghost image styling could go here
	};

	// 2. Logic: Rename Item
	const handleRenameSubmit = (id: string, newName: string) => {
		setItems((prevItems) => {
			const updateRecursive = (
				list: FileSystemItem[]
			): FileSystemItem[] => {
				return list.map((item) => {
					if (item.id === id) {
						return { ...item, name: newName };
					}
					if (item.children) {
						return {
							...item,
							children: updateRecursive(item.children),
						};
					}
					return item;
				});
			};
			return updateRecursive(prevItems);
		});
		setRenamingId(null);
	};

	const handleDropOnFolder = (e: React.DragEvent, targetFolderId: string) => {
		e.preventDefault();
		e.stopPropagation();

		if (!draggedItem) return;

		// Constraint: Folders cannot be dropped into folders
		if (draggedItem.type === "folder") return;

		// Constraint: Don't drop into itself (redundant check for files, but good practice)
		if (draggedItem.parentId === targetFolderId) return;

		moveFile(draggedItem.id, targetFolderId);
		setDraggedItem(null);
	};

	const handleDropOnRoot = (e: React.DragEvent) => {
		e.preventDefault();
		if (!draggedItem) return;

		// If it's already in root, do nothing
		if (!draggedItem.parentId) return;

		moveFile(draggedItem.id, null); // null = root
	};

	const moveFile = (fileId: string, targetParentId: string | null) => {
		setItems((prevItems) => {
			// 1. Find and remove the file from its current location
			let movedFile: FileSystemItem | null = null;

			// Helper to recursively remove
			const removeFromList = (
				list: FileSystemItem[]
			): FileSystemItem[] => {
				return list.reduce((acc, item) => {
					if (item.id === fileId) {
						movedFile = { ...item, parentId: targetParentId }; // Update parentId
						return acc; // Exclude it
					}
					if (item.children) {
						return [
							...acc,
							{
								...item,
								children: removeFromList(item.children),
							},
						];
					}
					return [...acc, item];
				}, [] as FileSystemItem[]);
			};

			const cleanList = removeFromList(prevItems);

			if (!movedFile) return prevItems; // Should not happen

			// 2. Add to new location
			if (targetParentId === null) {
				// Add to root
				return [...cleanList, movedFile!];
			} else {
				// Add to specific folder
				return cleanList.map((item) => {
					if (item.id === targetParentId && item.type === "folder") {
						return {
							...item,
							children: [...(item.children || []), movedFile!],
						};
					}
					return item;
				});
			}
		});
	};

	// --- Logic: Create New Folder ---
	const handleCreateFolder = () => {
		setItems((prevItems) => {
			const baseName = "New Folder";
			let newName = baseName;
			let counter = 1;

			// Simple check to find a unique name at the root level
			const existingNames = new Set(
				prevItems.filter((i) => i.parentId === null).map((i) => i.name)
			);

			while (existingNames.has(newName)) {
				newName = `${baseName} ${counter}`;
				counter++;
			}

			const newFolder: FileSystemItem = {
				id: `folder-${Date.now()}`, // Simple unique ID
				name: newName,
				type: "folder",
				children: [],
				isOpen: true, // Auto-open so user sees it immediately
				parentId: null,
			};

			// Add to the top of the list
			return [newFolder, ...prevItems];
		});
	};

	// --- Logic: Menu Actions ---
	const handleMenuClick = (e: React.MouseEvent, item: FileSystemItem) => {
		e.preventDefault();
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		setActiveMenu({ id: item.id, x: rect.right + 10, y: rect.top });
	};

	const handleMenuAction = (action: MenuAction) => {
		if (!activeMenu) return;

		// Find the item associated with the menu
		const findItem = (
			list: FileSystemItem[]
		): FileSystemItem | undefined => {
			for (const item of list) {
				if (item.id === activeMenu.id) return item;
				if (item.children) {
					const found = findItem(item.children);
					if (found) return found;
				}
			}
		};

		const item = findItem(items);
		if (!item) return;

		if (action === "delete") setItemToDelete(item);
		if (action === "move") setItemToMove(item);
		if (action === "rename") setRenamingId(item.id);
		if (action === "share") console.log("Trigger Share for", item.name);

		setActiveMenu(null);
	};

	const confirmDelete = () => {
		if (!itemToDelete) return;
		setItems((prev) => {
			const removeRecursive = (
				list: FileSystemItem[]
			): FileSystemItem[] => {
				return list
					.filter((i) => i.id !== itemToDelete.id)
					.map((i) => ({
						...i,
						children: i.children ? removeRecursive(i.children) : [],
					}));
			};
			return removeRecursive(prev);
		});
		setItemToDelete(null);
	};

	// --- Render Helpers ---
	const renderRootItem = (item: FileSystemItem) => {
		const isRenaming = item.id === renamingId;
		if (item.type === "folder") {
			return (
				<Folder
					key={item.id}
					item={item}
					depth={0}
					// Pass Rename Props
					renamingId={renamingId}
					onRenameSubmit={handleRenameSubmit}
					onCancelRename={() => setRenamingId(null)}
					onToggle={handleToggleFolder}
					onMenuClick={handleMenuClick}
					onItemClick={(i) => console.log("Open File:", i.name)}
					onDragStart={handleDragStart}
					onDropOnFolder={handleDropOnFolder}
				/>
			);
		} else {
			// Root-level File
			return (
				<div
					key={item.id}
					draggable={!isRenaming}
					onDragStart={(e) => handleDragStart(e, item)}
					title={isCollapsed ? item.name : undefined}
					style={{ paddingRight: "8px" }}
				>
					{isRenaming ? (
						<div style={{ padding: "6px 16px" }}>
							<RenameInput
								initialValue={item.name}
								onSave={(newName) =>
									handleRenameSubmit(item.id, newName)
								}
								onCancel={() => setRenamingId(null)}
							/>
						</div>
					) : (
						<ProjectButton
							text={item.name}
							icon={<img src={VerticalDotsIcon} alt="menu" />}
							onMenuClick={(e) => handleMenuClick(e, item)}
							// Render menu inside button if active to handle z-indexing correctly
							menuComponent={
								activeMenu?.id === item.id ? (
									<ProjectOptionsMenu
										onAction={handleMenuAction}
										onClose={() => setActiveMenu(null)}
										// Folders shouldn't be moved inside other folders via menu logic if strictly 1-level
										hideMove={false}
									/>
								) : null
							}
						/>
					)}
				</div>
			);
		}
	};

	return (
		<>
			<nav
				className={classNames(styles.sidebar, {
					[styles.collapsed]: isCollapsed,
					[styles.expanded]: !isCollapsed,
				})}
				onDragOver={(e) => e.preventDefault()} // Allow dragging over sidebar
				onDrop={handleDropOnRoot} // Catch drops on empty space -> move to root
			>
				{/* Header */}
				<div className={isCollapsed ? styles.header : styles.header2}>
					{!isCollapsed && (
						<div className={styles.logoContainer}>
							<img
								src={ApertureLogo}
								className={styles.logoIcon}
								alt="Logo"
							/>
							<span className={styles.brandName}>APERTURE</span>
						</div>
					)}
					<button onClick={toggleSidebar} className={styles.menuBtn}>
						<img
							src={VerticalLineIcon}
							className={styles.menuBtnIcon}
							alt="Menu"
						/>
					</button>
				</div>

				{/* Main Navigation (New Project, Search, New Folder) */}
				<div className={styles.navSection}>
					<IconButton
						text="New Project"
						icon={
							<img
								src={newProjectIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						iconHover={
							<img
								src={newProjectFillIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						mode={isCollapsed ? "icon" : "default"}
						fullWidth={true}
					/>
					<IconButton
						text="Search"
						icon={
							<img
								src={SearchIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						iconHover={
							<img
								src={SearchIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						mode={isCollapsed ? "icon" : "default"}
						fullWidth={true}
					/>
					<IconButton
						text="New Folder"
						icon={
							<img
								src={NewFolderIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						iconHover={
							<img
								src={NewFolderFillIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						mode={isCollapsed ? "icon" : "default"}
						fullWidth={true}
						onClick={handleCreateFolder}
					/>
				</div>

				{/* Projects List */}
				<div className={styles.projectsHeader}>
					{!isCollapsed && "Projects"}
				</div>

				<div className={styles.projectList}>
					{!isCollapsed
						? items.map((item) => renderRootItem(item))
						: // Collapsed View: Just show icons (simplified for now)
						  items.map((item) => (
								<div
									key={item.id}
									className={styles.collapsedItem}
								>
									{/* You might want a specific 'collapsed' mode for Folder too, 
                                    currently just showing files/folders similarly or hiding */}
								</div>
						  ))}
				</div>

				{/* Footer */}
				<div className={styles.footer}>
					<IconButton
						text="Settings"
						icon={
							<img
								src={SettingsIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						iconHover={
							<img
								src={SettingsFillIcon}
								width={16}
								height={11}
								alt="icon"
							/>
						}
						mode={isCollapsed ? "icon" : "default"}
						fullWidth={true}
					/>
				</div>
			</nav>

			{/* --- Modals --- */}

			{/* 1. Global Menu (Positioned Absolute) - If not using the in-button render approach
                Note: We used the in-button 'menuComponent' prop for root files, 
                but for Folders, we might need an absolute positioned menu if the Folder component 
                doesn't support the 'menuComponent' prop slot yet. 
                
                Below acts as a fallback or the main menu for Folders/Nested items. 
            */}
			{activeMenu &&
				items.find((i) => i.id === activeMenu.id)?.type ===
					"folder" && (
					<div
						style={{
							position: "fixed",
							top: activeMenu.y,
							left: activeMenu.x,
							zIndex: 100,
						}}
					>
						<ProjectOptionsMenu
							onAction={handleMenuAction}
							onClose={() => setActiveMenu(null)}
							hideMove={true} // Cannot move folders into folders
						/>
					</div>
				)}

			{/* 2. Dialogs */}
			<DeleteConfirmDialog
				isOpen={!!itemToDelete}
				projectName={itemToDelete?.name || ""}
				onConfirm={confirmDelete}
				onCancel={() => setItemToDelete(null)}
			/>

			<MoveToFolderDialog
				isOpen={!!itemToMove}
				projectName={itemToMove?.name || ""}
				onClose={() => setItemToMove(null)}
				onMove={(folderName, isNew) => {
					// This would need logic to find folder ID by name or create new
					console.log("Move to", folderName, isNew);
					// Actual implementation would lookup folder ID -> calls moveFile(itemToMove.id, folderId)
					setItemToMove(null);
				}}
			/>
		</>
	);
};
