import React from "react";
import "./ProjectButton.css";

type Props = {
	text: string;
	icon: React.ReactNode;
	onClick?: () => void; // Kliks the whole row (Open Project)
	onMenuClick?: (e: React.MouseEvent) => void; // Clicks just the dots
};

const ProjectButton: React.FC<Props> = ({
	text,
	icon,
	onClick,
	onMenuClick,
}) => {
	const handleIconClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevents opening the project
		onMenuClick?.(e);
	};

	return (
		<div
			className="project-btn"
			onClick={onClick}
			role="button"
			tabIndex={0}
		>
			{/* Wrapper ensures text creates space for the cursor */}
			<div className="text-container">
				<span className="project-text">{text}</span>
				{/* The cursor is now a separate span so flexbox respects it */}
				<span className="cursor-underscore">_</span>
			</div>

			<button
				className="project-icon-wrapper"
				onClick={handleIconClick}
				aria-label="Project options"
			>
				<span className="project-icon">{icon}</span>
			</button>
		</div>
	);
};

export default ProjectButton;
