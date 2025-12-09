import React from "react";
import "./Auth.css";
import { useAuthLogic } from "./useAuthLogic";
import { AuthEditor } from "./AuthEditor";
import { AuthBottomPanel } from "./AuthBottomPanel";

interface AuthProps {
	onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
	// Destructure all the logic, state, and handlers from the hook
	const {
		activeTab,
		switchTab,
		activePanel,
		setActivePanel,
		formData,
		errors,
		terminalLogs,
		isLoading,
		handleInputChange,
		handleFileUpload,
		handleSubmit,
		clearLogs,
	} = useAuthLogic({ onLogin });

	const errorCount = Object.keys(errors).length;

	return (
		<div className="ide-auth-container">
			<div className="bg-grid"></div>
			<h1 className="app-branding">PROJECT APERTURE</h1>

			<div
				className={`ide-window ${errorCount > 0 ? "window-shake" : ""}`}
			>
				{/* --- LEFT SIDEBAR (Activity Bar) --- */}
				<div className="activity-bar">
					<div className="icon active">
						{/* Files Icon */}
						<svg
							viewBox="0 0 24 24"
							width="24"
							height="24"
							stroke="currentColor"
							strokeWidth="1.5"
							fill="none"
						>
							<rect
								x="3"
								y="11"
								width="18"
								height="11"
								rx="2"
								ry="2"
							></rect>
							<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
						</svg>
					</div>
					<div className="icon">
						{/* Git/Source Control Icon */}
						<svg
							viewBox="0 0 24 24"
							width="24"
							height="24"
							stroke="currentColor"
							strokeWidth="1.5"
							fill="none"
						>
							<circle cx="18" cy="18" r="3"></circle>
							<circle cx="6" cy="6" r="3"></circle>
							<path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
							<line x1="6" y1="9" x2="6" y2="21"></line>
						</svg>
					</div>
					<div className="spacer"></div>
					<div className="icon">
						{/* Settings Icon */}
						<svg
							viewBox="0 0 24 24"
							width="24"
							height="24"
							stroke="currentColor"
							strokeWidth="1.5"
							fill="none"
						>
							<circle cx="12" cy="12" r="3"></circle>
							<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
						</svg>
					</div>
				</div>

				<div className="main-editor-area">
					{/* --- TOP TABS --- */}
					<div className="ide-tabs">
						<div
							className={`tab ${
								activeTab === "login" ? "active" : ""
							}`}
							onClick={() => switchTab("login")}
						>
							<span className="ts-icon">TS</span> Login.tsx{" "}
							{errorCount > 0 && activeTab === "login" && (
								<span className="tab-error-dot">●</span>
							)}
						</div>
						<div
							className={`tab ${
								activeTab === "signup" ? "active" : ""
							}`}
							onClick={() => switchTab("signup")}
						>
							<span className="ts-icon">TS</span> Signup.tsx
							{errorCount > 0 && activeTab === "signup" && (
								<span className="tab-error-dot">●</span>
							)}
						</div>
						{/* Recovery Tab (Transient, only shows when active) */}
						{activeTab === "recovery" && (
							<div className="tab active italic">
								<span className="ts-icon">TS</span> recovery.ts
							</div>
						)}

						<div className="tab-spacer"></div>
						<div className="window-controls">
							<span className="dot yellow"></span>
							<span className="dot green"></span>
							<span className="dot red"></span>
						</div>
					</div>

					{/* --- MAIN EDITOR COMPONENT --- */}
					<AuthEditor
						activeTab={activeTab}
						switchTab={switchTab}
						errors={errors}
						handleInputChange={handleInputChange}
						handleFileUpload={handleFileUpload}
						handleSubmit={handleSubmit}
						isLoading={isLoading}
						formData={formData}
					/>

					{/* --- BOTTOM PANEL COMPONENT --- */}
					<AuthBottomPanel
						activePanel={activePanel}
						setActivePanel={setActivePanel}
						terminalLogs={terminalLogs}
						errors={errors}
						activeTab={activeTab}
						clearLogs={clearLogs}
					/>

					{/* --- STATUS BAR --- */}
					<div className="ide-status-bar">
						<div className="status-left">
							<span className="remote-icon">
								<span className="remote-bg"></span>
							</span>
							<span>main*</span>
							<span className="sync-icon">
								{errorCount > 0 ? (
									<span className="status-error">
										ⓧ {errorCount} Errors
									</span>
								) : (
									<span>0 Errors</span>
								)}
							</span>
							{isLoading && (
								<span style={{ marginLeft: "10px" }}>
									Building...
								</span>
							)}
						</div>
						<div className="status-right">
							<span>
								Ln {activeTab === "signup" ? 16 : 12}, Col 1
							</span>
							<span>UTF-8</span>
							<span>TypeScript React</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
