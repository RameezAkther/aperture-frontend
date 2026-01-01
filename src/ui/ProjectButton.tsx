// src/ui/ProjectButton.tsx
import React from "react";
import "./ProjectButton.css";

type Props = {
	text: string;
	icon: React.ReactNode;
	onClick?: () => void;
	onMenuClick?: (e: React.MouseEvent) => void;
	menuComponent?: React.ReactNode;
};

const ProjectButton: React.FC<Props> = ({
	text,
	icon,
	onClick,
	onMenuClick,
	menuComponent,
}) => {
	const handleIconClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Stops opening the project when clicking dots
		onMenuClick?.(e);
	};

	// NEW: Wrapper to stop menu clicks from bubbling up to the row
	const handleMenuWrapperClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			className="project-btn"
			onClick={onClick}
			role="button"
			tabIndex={0}
			// Z-Index fix: If menu is open (menuComponent exists), raise this row above others
			style={{ zIndex: menuComponent ? 20 : 1, position: "relative" }}
		>
			<div className="text-container">
				<span className="project-text">{text}</span>
				<span className="cursor-underscore">_</span>
			</div>

			<div style={{ position: "relative" }}>
				<button
					className="project-icon-wrapper"
					onClick={handleIconClick}
				>
					<span className="project-icon">{icon}</span>
				</button>

				{/* Wrap menu to stop bubbling */}
				{menuComponent && (
					<div
						onClick={handleMenuWrapperClick}
						style={{ position: "absolute", right: 0, top: "100%" }}
					>
						{menuComponent}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectButton;
