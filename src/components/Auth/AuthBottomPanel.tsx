import React, { useEffect, useRef } from "react";

interface AuthBottomPanelProps {
	activePanel: "terminal" | "problems";
	setActivePanel: (panel: "terminal" | "problems") => void;
	terminalLogs: string[];
	errors: { [key: string]: string };
	activeTab: "login" | "signup" | "recovery"; // Updated to include recovery
	clearLogs: () => void;
}

export const AuthBottomPanel: React.FC<AuthBottomPanelProps> = ({
	activePanel,
	setActivePanel,
	terminalLogs,
	errors,
	activeTab,
	clearLogs,
}) => {
	const errorCount = Object.keys(errors).length;

	// Ref attaches to the scrollable container
	const panelBodyRef = useRef<HTMLDivElement>(null);

	// Auto-scroll logic
	useEffect(() => {
		if (activePanel === "terminal" && panelBodyRef.current) {
			const { scrollHeight, clientHeight } = panelBodyRef.current;
			// Only scroll if content is taller than the container
			if (scrollHeight > clientHeight) {
				panelBodyRef.current.scrollTop = scrollHeight;
			}
		}
	}, [terminalLogs, activePanel]);

	return (
		<div className="ide-bottom-panel">
			<div className="panel-header">
				{/* Left Side: Tabs */}
				<div className="header-tabs">
					<span
						className={
							activePanel === "problems" ? "active-tab" : ""
						}
						onClick={() => setActivePanel("problems")}
					>
						PROBLEMS{" "}
						{errorCount > 0 && (
							<span className="badge">{errorCount}</span>
						)}
					</span>
					<span
						className={
							activePanel === "terminal" ? "active-tab" : ""
						}
						onClick={() => setActivePanel("terminal")}
					>
						TERMINAL
					</span>
					<span>OUTPUT</span>
				</div>

				{/* Right Side: Actions */}
				{activePanel === "terminal" && (
					<div
						className="header-actions"
						onClick={clearLogs}
						title="Clear Terminal"
					>
						<svg
							viewBox="0 0 24 24"
							width="14"
							height="14"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line
								x1="4.93"
								y1="4.93"
								x2="19.07"
								y2="19.07"
							></line>
						</svg>
						<span className="action-text">CLEAR</span>
					</div>
				)}
			</div>

			<div className="panel-body" ref={panelBodyRef}>
				{activePanel === "terminal" ? (
					<>
						{terminalLogs.map((log, i) => (
							<div key={i} className="term-line">
								<span className="term-path">
									root@aperture:~$
								</span>{" "}
								{log}
							</div>
						))}
						<div className="term-cursor">_</div>
					</>
				) : (
					<div className="problems-list">
						{errorCount === 0 ? (
							<div className="no-problems">
								No problems have been detected in the workspace.
							</div>
						) : (
							Object.entries(errors).map(([field, msg], i) => (
								<div key={i} className="problem-item">
									<span className="error-icon">ⓧ</span>
									<span className="error-msg">{msg}</span>
									<span className="error-loc">
										[{field}] Ln{" "}
										{activeTab === "signup" ? i + 7 : i + 6}
										, Col 12
									</span>
								</div>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
};
