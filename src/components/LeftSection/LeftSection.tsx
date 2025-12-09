import React, { useState } from "react";
import styles from "./LeftSection.module.css";
import CanonicalIcon from "@/assets/res/canonical.svg";
import CanonicalFillIcon from "@/assets/res/canonical_fill.svg";
import DerivedIcon from "@/assets/res/derived.svg";
import DerivedFillIcon from "@/assets/res/derived_fill.svg";
import SessionIcon from "@/assets/res/session.svg";
import SessionFillIcon from "@/assets/res/session_fill.svg";
import AddSmallIcon from "@/assets/add/add_small.svg";
import AddSessionIcon from "@/assets/add/add_session.svg";
import AddSessionFillIcon from "@/assets/add/add_session_fill.svg";
import DeleteAllIcon from "@/assets/delete/delete_all.svg";
import DeleteAllFillIcon from "@/assets/delete/delete_all_fill.svg";
import VerticalDotsIcon from "@/assets/menu/vertical_dots.svg";
import ChevronDown from "@/assets/down/chevron_down.svg";
import { FileExplorer } from "@/ui/FileExplorer";
import { SessionTree } from "@/ui/SessionTree";

// 1. Add 'children' to the interface
interface SectionProps {
	title: string;
	icon: string;
	fillIcon: string;
	rightActions?: React.ReactNode;
	showDropdownArrow?: boolean;
	defaultOpen?: boolean;
	children?: React.ReactNode; // <--- ADD THIS
	className?: string;
}

const SectionCard: React.FC<SectionProps> = ({
	title,
	icon,
	fillIcon,
	rightActions,
	showDropdownArrow = false,
	defaultOpen = false,
	children,
	className,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div
			className={`${styles.card} ${className || ""}`}
			// --- FIX START ---
			// If closed, override the CSS to stop it from growing.
			// '0 0 auto' means: don't grow, don't shrink, size based on content (header).
			style={{ flex: isOpen ? undefined : "0 0 auto" }}
			// --- FIX END ---
		>
			{/* Header - (No changes here) */}
			<div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
				<div className={styles.titleGroup}>
					<span className={styles.mainIcon}>
						{isOpen ? (
							<img src={icon} className={styles.mainIconSize} />
						) : (
							<img
								src={fillIcon}
								className={styles.mainIconSize}
							/>
						)}
					</span>
					<span className={styles.titleText}>{title}</span>
					{showDropdownArrow && (
						<span
							className={`${styles.chevron} ${
								isOpen ? styles.rotate : ""
							}`}
						>
							<img src={ChevronDown} />
						</span>
					)}
				</div>

				<div
					className={styles.actions}
					onClick={(e) => e.stopPropagation()}
				>
					{rightActions}
				</div>
			</div>

			{/* Content Body - UPDATED LOGIC */}
			{/* Apply specific flex style to content wrapper if open */}
			{isOpen && (
				<div
					className={`${styles.content} ${
						className ? styles.flexContent : ""
					}`}
				>
					{children ? (
						children
					) : (
						<>
							<div className={styles.placeholderLine}></div>
							<div
								className={styles.placeholderLine}
								style={{ width: "70%" }}
							></div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export const LeftSection: React.FC = () => {
	return (
		<div className={styles.container}>
			{/* 1. Canonical Assets */}
			{/* 1. Canonical Assets - NOW HAS CHILDREN */}
			<SectionCard
				title="Canonical Assets"
				icon={CanonicalIcon}
				fillIcon={CanonicalFillIcon}
				defaultOpen={true} // Set to open so you can see the explorer immediately
				rightActions={
					<button className={styles.iconBtn}>
						<img
							src={AddSmallIcon}
							className={styles.addIconSize}
						/>
					</button>
				}
			>
				{/* The FileExplorer goes here */}
				<FileExplorer />
			</SectionCard>

			{/* 2. Derived Assets - NO CHILDREN (Will use fallback placeholders) */}
			<SectionCard
				title="Derived Assets"
				icon={DerivedIcon}
				fillIcon={DerivedFillIcon}
				rightActions={
					<button className={styles.iconBtn}>
						<img
							src={AddSmallIcon}
							className={styles.addIconSize}
						/>
					</button>
				}
			/>

			{/* 3. Session (The Complex One) */}
			<SectionCard
				title="Session"
				icon={SessionIcon}
				fillIcon={SessionFillIcon}
				showDropdownArrow={true}
				defaultOpen={true}
				className={styles.flexGrowCard}
				rightActions={
					<div className={styles.actionGroup}>
						<button className={styles.iconBtn} title="Add Page">
							<img
								src={AddSessionIcon}
								className={styles.addIconSize}
							/>
						</button>
						<button className={styles.iconBtn} title="Delete">
							<img
								src={DeleteAllIcon}
								className={styles.addIconSize}
							/>
						</button>
						<button className={styles.iconBtn} title="Menu">
							<img
								src={VerticalDotsIcon}
								className={styles.addIconSize}
							/>
						</button>
						<button className={styles.iconBtn} title="New">
							<img
								src={AddSmallIcon}
								className={styles.addIconSize}
							/>
						</button>
					</div>
				}
			>
				<SessionTree />
			</SectionCard>
		</div>
	);
};
