import React, { useState, useEffect, useRef } from "react";

type Props = {
	initialValue: string;
	onSave: (newName: string) => void;
	onCancel: () => void;
	className?: string; // To allow specific folder/file styling overrides
};

const RenameInput: React.FC<Props> = ({
	initialValue,
	onSave,
	onCancel,
	className,
}) => {
	const [value, setValue] = useState(initialValue);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Auto-focus and select all text on mount
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.stopPropagation(); // Prevent folder toggling if handled higher up
			if (value.trim()) onSave(value.trim());
			else onCancel(); // Revert if empty
		} else if (e.key === "Escape") {
			e.stopPropagation();
			onCancel();
		}
	};

	return (
		<input
			ref={inputRef}
			type="text"
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={() => (value.trim() ? onSave(value.trim()) : onCancel())}
			onKeyDown={handleKeyDown}
			className={className}
			// Basic styling to match the dark theme
			style={{
				background: "#000",
				border: "1px solid #444",
				color: "#fff",
				borderRadius: "4px",
				padding: "2px 6px",
				fontFamily: "inherit",
				fontSize: "inherit",
				width: "100%",
				outline: "none",
			}}
			onClick={(e) => e.stopPropagation()} // Stop click from toggling folder
		/>
	);
};

export default RenameInput;
