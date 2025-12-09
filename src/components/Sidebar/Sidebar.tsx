import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import classNames from "classnames";
import IconButton from "@/ui/IconButton";
import newProjectIcon from "@/assets/new_project/new_project.svg";
import newProjectFillIcon from "@/assets/new_project/new_project_fill.svg";
import ProjectButton from "@/ui/ProjectButton";
import VerticalDotsIcon from "@/assets/menu/vertical_dots.svg";
import VerticalLineIcon from "@/assets/menu/vertical_lines.svg";
import NewFolderIcon from "@/assets/new_folder/new_folder.svg";
import NewFolderFillIcon from "@/assets/new_folder/new_folder_fill.svg";
import SearchIcon from "@/assets/search/search.svg";
import SettingsIcon from "@/assets/settings/settings.svg";
import SettingsFillIcon from "@/assets/settings/settings_fill.svg";
import ApertureLogo from "@/assets/aperture_logo.svg";

interface Project {
	id: string;
	name: string;
	active?: boolean;
}

export const Sidebar: React.FC = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	// Mock data based on your screenshot
	const projects: Project[] = [
		{ id: "1", name: "Fix the code file for my Proje_", active: true },
		{ id: "2", name: "Technical rewriting" },
		{ id: "3", name: "Document Analysis and Next Steps_" },
		{ id: "4", name: "Health Monitoring System Documen_" },
		{ id: "5", name: "Recursive State-Management" },
		{ id: "6", name: "Zoho Hackathon 2025 Registration" },
	];

	const toggleSidebar = () => setIsCollapsed(!isCollapsed);

	return (
		<nav
			className={classNames(styles.sidebar, {
				[styles.collapsed]: isCollapsed,
				[styles.expanded]: !isCollapsed,
			})}
		>
			{/* Header */}
			<div className={isCollapsed ? styles.header : styles.header2}>
				{!isCollapsed && (
					<div className={styles.logoContainer}>
						<img src={ApertureLogo} className={styles.logoIcon} />
						<span className={styles.brandName}>APERTURE</span>
					</div>
				)}
				<button onClick={toggleSidebar} className={styles.menuBtn}>
					<img
						src={VerticalLineIcon}
						className={styles.menuBtnIcon}
					/>
				</button>
			</div>

			{/* Main Navigation */}
			<div className={styles.navSection}>
				<IconButton
					text="New Project"
					icon={
						<img
							src={newProjectIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					iconHover={
						<img
							src={newProjectFillIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					mode={isCollapsed ? "icon" : "default"}
					fullWidth={true}
				></IconButton>
				<IconButton
					text="Search"
					icon={
						<img
							src={SearchIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					iconHover={
						<img
							src={SearchIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					mode={isCollapsed ? "icon" : "default"}
					fullWidth={true}
				></IconButton>
				<IconButton
					text="New Folder"
					icon={
						<img
							src={NewFolderIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					iconHover={
						<img
							src={NewFolderFillIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					mode={isCollapsed ? "icon" : "default"}
					fullWidth={true}
				></IconButton>
			</div>

			{/* Projects List */}
			<div className={styles.projectsHeader}>
				{!isCollapsed && "Projects"}
			</div>

			<div className={styles.projectList}>
				{!isCollapsed &&
					projects.map((proj) => (
						<div
							key={proj.id}
							title={proj.name} // Tooltip for collapsed state
						>
							<ProjectButton
								text={proj.name}
								icon={<img src={VerticalDotsIcon}></img>}
							></ProjectButton>
						</div>
					))}
			</div>

			{/* Footer */}
			<div className={styles.footer}>
				<IconButton
					text="Settings"
					icon={
						<img
							src={SettingsIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					iconHover={
						<img
							src={SettingsFillIcon}
							width={16}
							height={11}
							alt="icon"
						/>
					}
					mode={isCollapsed ? "icon" : "default"}
					fullWidth={true}
				></IconButton>
			</div>
		</nav>
	);
};
