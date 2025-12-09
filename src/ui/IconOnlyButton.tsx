import React, { useState } from "react";

// --- Helper Component for Hover Effects ---
interface IconOnlyButtonProps {
	defaultIcon: string;
	fillIcon?: string; // Optional, falls back to default if not provided
	className?: string;
	classNameIcon?: string;
	onClick?: () => void;
}

export const IconOnlyButton: React.FC<IconOnlyButtonProps> = ({
	defaultIcon,
	fillIcon,
	className,
	classNameIcon = "",
	onClick,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const currentIcon = isHovered && fillIcon ? fillIcon : defaultIcon;

	return (
		<button
			className={className}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
		>
			<img src={currentIcon} className={classNameIcon} alt="icon" />
		</button>
	);
};
