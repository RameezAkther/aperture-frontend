import React, { useState, useRef, useEffect } from "react";

interface User {
	username: string;
	email: string;
	avatar?: string;
}

interface UserWidgetProps {
	user: User | null;
	onLogout: () => void;
	onLoginClick: () => void; // Used if we are in "Guest" mode
}

export const UserWidget: React.FC<UserWidgetProps> = ({
	user,
	onLogout,
	onLoginClick,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		setIsOpen(false);
		onLogout();
	};

	return (
		<div className="user-widget-container" ref={dropdownRef}>
			{/* AVATAR BUTTON */}
			<div
				className={`avatar-btn ${user ? "online" : "offline"}`}
				onClick={() => (user ? setIsOpen(!isOpen) : onLoginClick())}
				title={user ? user.username : "Guest (Click to Login)"}
			>
				{user?.avatar ? (
					<img
						src={user.avatar}
						alt="User Avatar"
						className="avatar-img"
					/>
				) : (
					<div className="avatar-placeholder">
						{user
							? user.username.substring(0, 2).toUpperCase()
							: "?"}
					</div>
				)}
			</div>

			{/* DROPDOWN MENU */}
			{isOpen && user && (
				<div className="user-dropdown">
					<div className="dropdown-header">
						<span className="user-name">{user.username}</span>
						<span className="user-email">{user.email}</span>
					</div>
					<div className="dropdown-divider"></div>
					<div
						className="dropdown-item warning"
						onClick={handleLogout}
					>
						<span className="icon">
							<svg
								viewBox="0 0 24 24"
								width="14"
								height="14"
								stroke="currentColor"
								strokeWidth="2"
								fill="none"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
								<polyline points="16 17 21 12 16 7"></polyline>
								<line x1="21" y1="12" x2="9" y2="12"></line>
							</svg>
						</span>
						Log Out
					</div>
				</div>
			)}
		</div>
	);
};
