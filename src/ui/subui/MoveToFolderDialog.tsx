import React, { useState } from "react";
import { Folder, Plus, Clock, Search, Check } from "lucide-react";
import "./MoveToFolderDialog.css";

type Props = {
	isOpen: boolean;
	projectName: string;
	onClose: () => void;
	onMove: (folderName: string, isNew: boolean) => void;
};

// Mock Data
const RECENT_FOLDERS = ["Documentation", "Archives", "Q1 Reports"];
const ALL_FOLDERS = [
	"Documentation",
	"Archives",
	"Q1 Reports",
	"Personal",
	"Experimentation",
	"Shared Assets",
	"Hackathon 2024",
];

const MoveToFolderDialog: React.FC<Props> = ({
	isOpen,
	projectName,
	onClose,
	onMove,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

	if (!isOpen) return null;

	// Filter folders based on search
	const filteredFolders = ALL_FOLDERS.filter((f) =>
		f.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Check if the user is typing a name that doesn't exist (trigger "Create")
	const isCreatingNew =
		searchQuery.length > 0 &&
		!ALL_FOLDERS.some((f) => f.toLowerCase() === searchQuery.toLowerCase());

	// --- NEW: Helper to handle clicking a folder ---
	const handleSelectFolder = (folderName: string) => {
		setSelectedFolder(folderName);
		setSearchQuery(folderName); // <--- This refills the search bar
	};

	const handleConfirm = () => {
		// Priority: If creating new, use query. If selected, use that.
		if (isCreatingNew) {
			onMove(searchQuery, true);
		} else if (selectedFolder || searchQuery) {
			// Use searchQuery as fallback if it matches an existing folder but selectedFolder state is desynced
			onMove(selectedFolder || searchQuery, false);
		}
		onClose();
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content move-dialog">
				<h3>Move "{projectName}"</h3>
				<p>Select a destination folder or create a new one.</p>

				{/* --- 1. Create / Search Input --- */}
				<div className="input-group">
					{isCreatingNew ? (
						<Plus size={18} className="input-icon highlight" />
					) : (
						<Search size={18} className="input-icon" />
					)}
					<input
						type="text"
						placeholder="Search or create new folder..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							// If the user types something that EXACTLY matches an existing folder, select it.
							// Otherwise, deselect to allow creation.
							const match = ALL_FOLDERS.find(
								(f) =>
									f.toLowerCase() ===
									e.target.value.toLowerCase()
							);
							setSelectedFolder(match || null);
						}}
						className="folder-input"
						autoFocus
					/>
				</div>

				{/* --- 2. Folder Lists --- */}
				<div className="folder-list-container">
					{/* Recent Section (Only show if not searching/filtering) */}
					{!searchQuery && (
						<>
							<div className="section-label">
								<Clock size={12} /> RECENT
							</div>
							{RECENT_FOLDERS.map((folder) => (
								<div
									key={`recent-${folder}`}
									className={`folder-item ${
										selectedFolder === folder
											? "selected"
											: ""
									}`}
									onClick={() => handleSelectFolder(folder)}
								>
									<Folder size={16} />
									<span>{folder}</span>
									{selectedFolder === folder && (
										<Check
											size={16}
											className="check-icon"
										/>
									)}
								</div>
							))}
						</>
					)}

					{/* All Folders Section */}
					<div className="section-label">
						{searchQuery ? "MATCHING FOLDERS" : "ALL FOLDERS"}
					</div>

					{filteredFolders.length > 0 ? (
						filteredFolders.map((folder) => (
							<div
								key={folder}
								className={`folder-item ${
									selectedFolder === folder ? "selected" : ""
								}`}
								onClick={() => handleSelectFolder(folder)}
							>
								<Folder size={16} />
								<span>{folder}</span>
								{selectedFolder === folder && (
									<Check size={16} className="check-icon" />
								)}
							</div>
						))
					) : (
						<div className="empty-state">
							{isCreatingNew ? (
								<span>
									Press "Move" to create{" "}
									<strong>"{searchQuery}"</strong>
								</span>
							) : (
								<span>No folders found</span>
							)}
						</div>
					)}
				</div>

				{/* --- 3. Actions --- */}
				<div className="modal-actions">
					<button className="btn-cancel" onClick={onClose}>
						Cancel
					</button>
					<button
						className="btn-confirm"
						onClick={handleConfirm}
						// Disable if empty OR if we are typing but it's not a new creation and not an exact match yet
						disabled={!searchQuery}
					>
						{isCreatingNew ? "Create & Move" : "Move Here"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default MoveToFolderDialog;
