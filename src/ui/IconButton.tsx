import React from "react";
import "./IconButton.css";

type Mode = "default" | "icon";

type Props = {
	text?: string;
	icon: React.ReactNode;
	iconHover?: React.ReactNode;
	mode?: Mode;
	fullWidth?: boolean;
	onClick?: () => void;
};

const IconButton: React.FC<Props> = ({
	text = "",
	icon,
	iconHover,
	mode = "default",
	fullWidth = false,
	onClick,
}) => {
	const widthClass =
		mode === "default" ? (fullWidth ? "full" : "fixed") : "icon-size";

	return (
		<button
			className={`custom-btn ${mode} ${widthClass}`}
			onClick={onClick}
		>
			{/* Base icon */}
			<span className="icon-wrapper default-icon">{icon}</span>

			{/* Hover icon */}
			{iconHover && (
				<span className="icon-wrapper hover-icon">{iconHover}</span>
			)}

			{/* Text only in default mode */}
			{mode === "default" && <span className="label">{text}</span>}
		</button>
	);
};

export default IconButton;
