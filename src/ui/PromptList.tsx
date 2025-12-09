import React from "react";
import styles from "./PromptList.module.css";
import CopyFillIcon from "@/assets/copy/copy.svg";
import CopyIcon from "@/assets/copy/copy_hollow.svg";
import VerticalDotsIcon from "@/assets/menu/vertical_dots.svg";
import { IconOnlyButton } from "./IconOnlyButton";

// --- Icons ---
const Icons = {
	Copy: () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
		</svg>
	),
	More: () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="1"></circle>
			<circle cx="12" cy="5" r="1"></circle>
			<circle cx="12" cy="19" r="1"></circle>
		</svg>
	),
};

const MOCK_MESSAGES = [
	{
		id: 1,
		type: "user",
		content: `go through this document - "Project APERTURE: Recursive State-Management Interface for LLMs\n1. Executive Summary\nCurrent Large Language Model (LLM) interfaces predominantly rely on a Linear Conversational Topology..."`,
	},
	{
		id: 2,
		type: "system",
		content: `I have analyzed the document "Project APERTURE." It proposes a sophisticated shift from the standard "Linear Conversation" model used by most LLMs today to a Recursive State-Management architecture.

Here is a breakdown of the core concepts and the structural logic proposed in the document.

1. Core Philosophy: Conversation vs. Engineering
The central thesis is that current LLM interactions suffer from "Context Drift" because they treat context as a chronological log of text.

• Current Model: A growing list of messages where early instructions get "diluted".
• APERTURE Model: Treats the LLM interaction as a State Machine. The LLM's output is not a "reply" to be read; it is a function that mutates the current knowledge state.`,
	},
	{
		id: 3,
		type: "user",
		content: `go through this document - "Project APERTURE: Recursive State-Management Interface for LLMs..."`,
	},
	{
		id: 2,
		type: "system",
		content: `I have analyzed the document "Project APERTURE." It proposes a sophisticated shift from the standard "Linear Conversation" model used by most LLMs today to a Recursive State-Management architecture.

Here is a breakdown of the core concepts and the structural logic proposed in the document.

1. Core Philosophy: Conversation vs. Engineering
The central thesis is that current LLM interactions suffer from "Context Drift" because they treat context as a chronological log of text.

• Current Model: A growing list of messages where early instructions get "diluted".
• APERTURE Model: Treats the LLM interaction as a State Machine. The LLM's output is not a "reply" to be read; it is a function that mutates the current knowledge state.`,
	},
];

export const PromptList: React.FC = () => {
	return (
		<div className={styles.listContainer}>
			{MOCK_MESSAGES.map((msg) => (
				<div
					key={msg.id}
					className={
						msg.type === "user"
							? styles.userMsgWrapper
							: styles.systemMsgWrapper
					}
				>
					{/* Message Content */}
					<div className={styles.msgContent}>{msg.content}</div>

					{/* System Footer (Copy/More) */}
					{msg.type === "system" && (
						<div className={styles.msgFooter}>
							<IconOnlyButton
								defaultIcon={CopyIcon}
								fillIcon={CopyFillIcon}
								className={styles.footerBtn}
								classNameIcon={styles.footerBtnIcon}
							></IconOnlyButton>
							<IconOnlyButton
								defaultIcon={VerticalDotsIcon}
								fillIcon={VerticalDotsIcon}
								className={styles.footerBtn}
								classNameIcon={styles.footerBtnIcon}
							></IconOnlyButton>
						</div>
					)}
				</div>
			))}
			{/* Spacer for scrolling clearance */}
			<div style={{ height: "20px" }}></div>
		</div>
	);
};
