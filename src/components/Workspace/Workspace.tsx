import React from "react";
import styles from "./Workspace.module.css";
import { PromptList } from "@/ui/PromptList";
import { PromptInput } from "@/ui/PromptInput";
import VerticalDotsIcon from "@/assets/menu/vertical_dots.svg"; // Or use inline if preferred

export const Workspace: React.FC = () => {
	return (
		<div className={styles.workspaceContainer}>
			{/* 1. Header (Floating Project Title) */}
			<header className={styles.header}>
				<div className={styles.projectPill}>
					<span className={styles.projectTitle}>
						Fix the code file for my Proje_
					</span>
					<button className={styles.headerMenuBtn}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="12" cy="12" r="1"></circle>
							<circle cx="12" cy="5" r="1"></circle>
							<circle cx="12" cy="19" r="1"></circle>
						</svg>
					</button>
				</div>
			</header>

			{/* 2. Scrollable Message Feed */}
			<div className={styles.feedScrollArea}>
				<PromptList />
			</div>

			{/* 3. Fixed Input Area */}
			<div className={styles.inputArea}>
				<PromptInput />
			</div>
		</div>
	);
};
