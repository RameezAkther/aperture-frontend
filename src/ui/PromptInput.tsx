import React, { useRef } from "react";
import styles from "./PromptInput.module.css";
import { IconOnlyButton } from "./IconOnlyButton";

// --- Assets ---
import AddSmallIcon from "@/assets/add/add_small.svg";
import AddListIcon from "@/assets/add/add_list.svg";
import AddListFillIcon from "@/assets/add/add_list_fill.svg";
import CloseIcon from "@/assets/close/close.svg";
import SendIcon from "@/assets/send/send.svg";
import SendFillIcon from "@/assets/send/send_fill.svg";
import IconButton from "./IconButton";

export const PromptInput: React.FC = () => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	// --- Auto-Resize Logic ---
	const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
		const target = e.currentTarget;

		// 1. Reset height to auto to get the correct scrollHeight for shrinking
		target.style.height = "auto";

		// 2. Set new height based on content
		target.style.height = `${target.scrollHeight}px`;
	};

	return (
		<div className={styles.inputContainer}>
			{/* 1. Text Area */}
			<textarea
				ref={textAreaRef}
				className={styles.textArea}
				placeholder="Send a message..."
				rows={1}
				onInput={handleInput}
			/>

			{/* 2. Toolbar */}
			<div className={styles.toolbar}>
				<div className={styles.toolbarLeft}>
					{/* Standard Add Button (assuming standard hover behavior) */}
					<IconButton
						text=""
						icon={<img src={AddSmallIcon}></img>}
						iconHover={<img src={AddSmallIcon}></img>}
						mode="icon"
					></IconButton>

					{/* Add List Button (Swaps to Fill) */}
					<IconButton
						text=""
						icon={<img src={AddListIcon}></img>}
						iconHover={<img src={AddListFillIcon}></img>}
						mode="icon"
					></IconButton>

					{/* Context Pills */}
					<div className={styles.pillContainer}>
						<div className={styles.pill}>
							<span>--Python Only</span>
							<button className={styles.pillClose}>
								<img src={CloseIcon} alt="Remove" />
							</button>
						</div>
						<div className={styles.pill}>
							<span>--No Comment lines</span>
							<button className={styles.pillClose}>
								<img src={CloseIcon} alt="Remove" />
							</button>
						</div>
					</div>
				</div>

				<div className={styles.toolbarRight}>
					{/* Send Button (Swaps to Fill) */}
					<IconOnlyButton
						defaultIcon={SendIcon}
						fillIcon={SendFillIcon}
						className={styles.sendBtn}
					/>
				</div>
			</div>
		</div>
	);
};
