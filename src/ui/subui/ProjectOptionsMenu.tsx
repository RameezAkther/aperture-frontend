import React, { useEffect, useRef } from "react";
import { Share2, Pencil, FolderInput, Trash2 } from "lucide-react";
import "./ProjectOptionsMenu.css";

export type MenuAction = "share" | "rename" | "move" | "delete";

type Props = {
	onAction: (action: MenuAction) => void;
	onClose: () => void;
	hideMove?: boolean; // NEW PROP
};

const ProjectOptionsMenu: React.FC<Props> = ({
	onAction,
	onClose,
	hideMove,
}) => {
	const menuRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	return (
		<ul className="project-options-menu" ref={menuRef}>
			<li onClick={() => onAction("share")}>
				<Share2 size={14} /> <span>Share</span>
			</li>
			<li onClick={() => onAction("rename")}>
				<Pencil size={14} /> <span>Rename</span>
			</li>

			{/* Conditionally Render Move Option */}
			{!hideMove && (
				<li onClick={() => onAction("move")}>
					<FolderInput size={14} /> <span>Move to Folder</span>
				</li>
			)}

			<div className="menu-divider"></div>
			<li className="danger" onClick={() => onAction("delete")}>
				<Trash2 size={14} /> <span>Delete</span>
			</li>
		</ul>
	);
};

export default ProjectOptionsMenu;
