import React, { useRef, useEffect } from "react";
import styles from "./SessionTree.module.css";

// --- Types ---
type NodeType = "user" | "assistant" | "error" | "merge";

interface SessionNode {
	id: string;
	type: NodeType;
	title: string;
	preview: string;
	depth: number; // 0 = Mainline, 1 = Branch, etc.
}

// --- Icons ---
const UserAvatarIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
		<circle cx="12" cy="7" r="4"></circle>
	</svg>
);
const AiIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
		<path d="M12 16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"></path>
		<line x1="12" y1="8" x2="12" y2="16"></line>
		<line x1="8" y1="12" x2="16" y2="12"></line>
	</svg>
);
const MergeIcon = () => (
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M6 9l6 6 6-6"></path>
	</svg>
); // Downward merge arrow
const DotsVertical = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<circle cx="12" cy="12" r="1"></circle>
		<circle cx="12" cy="5" r="1"></circle>
		<circle cx="12" cy="19" r="1"></circle>
	</svg>
);
const PlusIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<line x1="12" y1="5" x2="12" y2="19"></line>
		<line x1="5" y1="12" x2="19" y2="12"></line>
	</svg>
);

// --- Mock Data with Branching/Threading ---
const sessionData: SessionNode[] = [
	{
		id: "1",
		type: "user",
		depth: 0,
		title: "Project APERTURE Initial Prompt",
		preview: "1. Executive Summary...",
	},
	{
		id: "2",
		type: "assistant",
		depth: 0,
		title: "Analysis Complete",
		preview:
			"It proposes a sophisticated shift from the standard Linear Conversation model.",
	},

	// Start of a Thread (Depth 1)
	{
		id: "3",
		type: "user",
		depth: 1,
		title: "Clarify Section 2.1",
		preview:
			"Can you expand on the recursive state mechanics described here?",
	},
	{
		id: "4",
		type: "assistant",
		depth: 1,
		title: "Recursive Mechanics",
		preview:
			"The recursive state management allows the LLM to traverse previous context nodes.",
	},

	// A sub-thread or error within the thread
	{
		id: "5",
		type: "error",
		depth: 1,
		title: "Context Limit Reached",
		preview: "The recursive depth exceeded the token window.",
	},

	// Merge back to Mainline (Depth 0)
	{
		id: "6",
		type: "merge",
		depth: 0,
		title: "Thread Merged",
		preview:
			"The recursive mechanics discussion has been consolidated into the main context.",
	},

	// Continuing Mainline
	{
		id: "7",
		type: "user",
		depth: 0,
		title: "Generate Implementation Plan",
		preview:
			"Based on the consolidated context, provide a Python implementation.",
	},
	{
		id: "8",
		type: "assistant",
		depth: 0,
		title: "Python Implementation",
		preview: "Here is the class structure for the StateManager...",
	},
	{
		id: "7",
		type: "user",
		depth: 0,
		title: "Generate Implementation Plan",
		preview:
			"Based on the consolidated context, provide a Python implementation.",
	},
	{
		id: "8",
		type: "assistant",
		depth: 0,
		title: "Python Implementation",
		preview: "Here is the class structure for the StateManager...",
	},
	{
		id: "7",
		type: "user",
		depth: 0,
		title: "Generate Implementation Plan",
		preview:
			"Based on the consolidated context, provide a Python implementation.",
	},
	{
		id: "8",
		type: "assistant",
		depth: 0,
		title: "Python Implementation",
		preview: "Here is the class structure for the StateManager...",
	},
	{
		id: "7",
		type: "user",
		depth: 0,
		title: "Generate Implementation Plan",
		preview:
			"Based on the consolidated context, provide a Python implementation.",
	},
	{
		id: "8",
		type: "assistant",
		depth: 0,
		title: "Python Implementation",
		preview: "Here is the class structure for the StateManager...",
	},
	{
		id: "7",
		type: "user",
		depth: 0,
		title: "Generate Implementation Plan",
		preview:
			"Based on the consolidated context, provide a Python implementation.",
	},
	{
		id: "8",
		type: "assistant",
		depth: 0,
		title: "Python Implementation",
		preview: "Here is the class structure for the StateManager...",
	},
];

export const SessionTree: React.FC = () => {
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom on load (optional, common for chat)
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, []);

	return (
		<div className={styles.scrollViewport} ref={scrollRef}>
			{sessionData.map((node, index) => {
				const prevNode = sessionData[index - 1];
				// Check if we just branched deeper (prev 0 -> curr 1)
				const isBranchingStart =
					prevNode && node.depth > prevNode.depth;

				return (
					<div
						key={node.id}
						className={styles.nodeWrapper}
						style={{ marginLeft: `${node.depth * 24}px` }} // Dynamic Indentation
					>
						{/* 1. Vertical Line Segment (Context line) */}
						<div className={styles.lineSegment}></div>

						{/* 2. Visual Curve if branching */}
						{isBranchingStart && (
							<div className={styles.branchCurve}></div>
						)}

						{/* 3. The Avatar/Icon */}
						<div
							className={`${styles.avatar} ${
								node.depth > 0 ? styles.mini : ""
							}`}
						>
							{node.type === "user" && <UserAvatarIcon />}
							{node.type === "assistant" && <AiIcon />}
							{node.type === "merge" && <MergeIcon />}
							{node.type === "error" && (
								<span style={{ color: "#c53b79" }}>!</span>
							)}
						</div>

						{/* 4. The Content Card */}
						<div
							className={`
              ${styles.card} 
              ${node.type === "user" ? styles.cardUser : ""}
              ${node.type === "assistant" ? styles.cardAi : ""}
              ${node.type === "error" ? styles.cardAiError : ""}
              ${node.type === "merge" ? styles.cardMerge : ""}
            `}
						>
							<div className={styles.cardTitle}>
								{node.type === "merge" && (
									<span className={styles.mergeIcon}>
										<MergeIcon />
									</span>
								)}
								{node.title}
							</div>
							<div className={styles.cardPreview}>
								{node.preview}
							</div>

							{/* Actions */}
							<div className={styles.cardActions}>
								<button
									className={styles.actionBtn}
									title="Menu"
								>
									<DotsVertical />
								</button>
								<button
									className={`${styles.actionBtn}`}
									title="New Branch"
								>
									<PlusIcon />
								</button>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
