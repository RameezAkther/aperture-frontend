import React, { useState } from "react";
import ProjectButton from "./ProjectButton";
import RenameInput from "@/ui/subui/RenameInput"; // Import the helper
import { ChevronRight, ChevronDown } from "lucide-react";
import FolderIcon from "@/assets/folder/folder.svg";
import FolderFillIcon from "@/assets/folder/folder_fill.svg";
import VerticalDotsIcon from "@/assets/menu/vertical_dots.svg";
import "./Folder.css";
import { type FileSystemItem } from "@/types";

type Props = {
	item: FileSystemItem;
	depth: number;
	onToggle: (id: string) => void;
	onMenuClick: (e: React.MouseEvent, item: FileSystemItem) => void;
	onItemClick: (item: FileSystemItem) => void;
	onDragStart: (e: React.DragEvent, item: FileSystemItem) => void;
	onDropOnFolder: (e: React.DragEvent, targetFolderId: string) => void;

	// --- NEW PROPS ---
	renamingId: string | null;
	onRenameSubmit: (id: string, newName: string) => void;
	onCancelRename: () => void;
};

const Folder: React.FC<Props> = ({
	item,
	depth,
	onToggle,
	onMenuClick,
	onItemClick,
	onDragStart,
	onDropOnFolder,
	renamingId,
	onRenameSubmit,
	onCancelRename,
}) => {
	const [isDragOver, setIsDragOver] = useState(false);

	// Check if THIS folder is being renamed
	const isRenamingSelf = item.id === renamingId;

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	};
	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
		onDropOnFolder(e, item.id);
	};

	return (
		<div className="folder-container">
			{/* 1. Folder Header */}
			<div
				className={`folder-header ${isDragOver ? "drag-target" : ""}`}
				style={{ paddingLeft: `${depth * 12 + 12}px` }}
				onClick={() => !isRenamingSelf && onToggle(item.id)} // Disable toggle if renaming
				draggable={!isRenamingSelf}
				onDragStart={(e) => onDragStart(e, item)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<div className="folder-icon-area">
					<span className="folder-chevron">
						{item.isOpen ? (
							<ChevronDown size={14} />
						) : (
							<ChevronRight size={14} />
						)}
					</span>
					<img
						src={item.isOpen ? FolderFillIcon : FolderIcon}
						alt="Folder"
						className="folder-svg"
					/>
				</div>

				{/* CONDITIONAL RENDER: Input vs Text */}
				{isRenamingSelf ? (
					<div style={{ flex: 1, marginRight: "8px" }}>
						<RenameInput
							initialValue={item.name}
							onSave={(val) => onRenameSubmit(item.id, val)}
							onCancel={onCancelRename}
						/>
					</div>
				) : (
					<>
						<span className="folder-name">{item.name}</span>
						<button
							className="folder-menu-btn"
							onClick={(e) => {
								e.stopPropagation();
								onMenuClick(e, item);
							}}
						>
							<img src={VerticalDotsIcon} alt="menu" />
						</button>
					</>
				)}
			</div>

			{/* 2. Children */}
			{item.isOpen && item.children && (
				<div className="folder-children">
					{item.children.map((child) => {
						const isChildRenaming = child.id === renamingId;

						return (
							<div key={child.id}>
								{child.type === "folder" ? (
									<Folder
										item={child}
										depth={depth + 1}
										onToggle={onToggle}
										onMenuClick={onMenuClick}
										onItemClick={onItemClick}
										onDragStart={onDragStart}
										onDropOnFolder={onDropOnFolder}
										// Pass props down recursively
										renamingId={renamingId}
										onRenameSubmit={onRenameSubmit}
										onCancelRename={onCancelRename}
									/>
								) : (
									/* FILE CHILD */
									<div
										draggable={!isChildRenaming}
										onDragStart={(e) =>
											onDragStart(e, child)
										}
										style={{
											paddingLeft: `${
												(depth + 1) * 12
											}px`,
											paddingRight: "8px",
										}}
									>
										{isChildRenaming ? (
											<div
												style={{ padding: "6px 16px" }}
											>
												<RenameInput
													initialValue={child.name}
													onSave={(val) =>
														onRenameSubmit(
															child.id,
															val
														)
													}
													onCancel={onCancelRename}
												/>
											</div>
										) : (
											<ProjectButton
												text={child.name}
												icon={
													<img
														src={VerticalDotsIcon}
														alt="menu"
													/>
												}
												onClick={() =>
													onItemClick(child)
												}
												onMenuClick={(e) =>
													onMenuClick(e, child)
												}
											/>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Folder;
