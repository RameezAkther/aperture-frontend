import React, { useState, useEffect } from "react";
import "./Auth.css";

interface AuthProps {
	onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [activePanel, setActivePanel] = useState<"terminal" | "problems">(
		"terminal"
	);

	// Form State
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		username: "",
	});

	// Linter State (Validation Errors)
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [terminalLogs, setTerminalLogs] = useState<string[]>([
		"Initializing Aperture Security Protocol...",
		"Loading language server...",
	]);

	// "Linter" Logic
	const validateField = (name: string, value: string) => {
		let errorMsg = "";

		if (name === "email") {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value) && value.length > 0)
				errorMsg = "Type 'string' is not assignable to type 'Email'.";
		}

		if (name === "password") {
			if (value.length < 6 && value.length > 0)
				errorMsg = "Password literal is too short (min 6 chars).";
		}

		if (name === "username" && activeTab === "signup") {
			if (value.length < 3 && value.length > 0)
				errorMsg = "Identifier expected to be > 3 chars.";
		}

		setErrors((prev) => {
			const newErrors = { ...prev };
			if (errorMsg) newErrors[name] = errorMsg;
			else delete newErrors[name];
			return newErrors;
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		validateField(name, value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Check for empty fields (Compiler Error)
		const newErrors: { [key: string]: string } = {};
		if (!formData.email)
			newErrors.email = "Argument 'email' cannot be undefined.";
		if (!formData.password)
			newErrors.password = "Argument 'password' cannot be undefined.";
		if (activeTab === "signup" && !formData.username)
			newErrors.username = "Argument 'username' cannot be undefined.";

		// Check existing errors
		const hasErrors =
			Object.keys(errors).length > 0 || Object.keys(newErrors).length > 0;

		if (hasErrors) {
			setErrors((prev) => ({ ...prev, ...newErrors }));
			setActivePanel("problems"); // Auto-switch to Problems tab
			setTerminalLogs((prev) => [
				...prev,
				`> [ERROR] Build failed with ${
					Object.keys(newErrors).length + Object.keys(errors).length
				} errors.`,
			]);
			return;
		}

		// Success Sequence
		setActivePanel("terminal");
		setTerminalLogs((prev) => [
			...prev,
			`> Compiling ${activeTab} sequence...`,
		]);
		setTerminalLogs((prev) => [
			...prev,
			`> POST /api/auth/${activeTab} [PENDING]`,
		]);

		setTimeout(() => {
			setTerminalLogs((prev) => [
				...prev,
				`> 200 OK. Session Token: ax99-f771-b2`,
			]);
			setTimeout(onLogin, 1000);
		}, 1200);
	};

	// Helper to render line number with optional error indicator
	const renderLineNumber = (num: number, fieldName?: string) => {
		const hasError = fieldName && errors[fieldName];
		return (
			<div className="line-num-wrapper" key={num}>
				{num}
				{hasError && <span className="gutter-error"></span>}
			</div>
		);
	};

	const errorCount = Object.keys(errors).length;

	return (
		<div className="ide-auth-container">
			<div className="bg-grid"></div>
			<h1 className="app-branding">PROJECT APERTURE</h1>

			<div
				className={`ide-window ${errorCount > 0 ? "window-shake" : ""}`}
			>
				{/* Activity Bar */}
				<div className="activity-bar">
					<div className="icon active">
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
				</div>

				<div className="main-editor-area">
					{/* Tabs */}
					<div className="ide-tabs">
						<div
							className={`tab ${
								activeTab === "login" ? "active" : ""
							}`}
							onClick={() => {
								setActiveTab("login");
								setErrors({});
							}}
						>
							<span className="ts-icon">TS</span> Login.tsx{" "}
							{errorCount > 0 && (
								<span className="tab-error-dot">●</span>
							)}
						</div>
						<div
							className={`tab ${
								activeTab === "signup" ? "active" : ""
							}`}
							onClick={() => {
								setActiveTab("signup");
								setErrors({});
							}}
						>
							<span className="ts-icon">TS</span> Signup.tsx
						</div>
						<div className="tab-spacer"></div>
						<div className="window-controls">
							<span className="dot yellow"></span>
							<span className="dot green"></span>
							<span className="dot red"></span>
						</div>
					</div>

					{/* Editor */}
					<div className="ide-editor">
						<div className="line-numbers">
							{[1, 2, 3, 4, 5, 6].map((n) => renderLineNumber(n))}
							{activeTab === "signup" &&
								renderLineNumber(7, "username")}
							{renderLineNumber(
								activeTab === "signup" ? 8 : 7,
								"email"
							)}
							{renderLineNumber(
								activeTab === "signup" ? 9 : 8,
								"password"
							)}
							{[10, 11, 12, 13, 14].map((n) =>
								renderLineNumber(
									n + (activeTab === "signup" ? 9 : 8)
								)
							)}
						</div>

						<form className="code-area" onSubmit={handleSubmit}>
							<div className="code-line">
								<span className="keyword">import</span>{" "}
								<span className="variable">UserSession</span>{" "}
								<span className="keyword">from</span>{" "}
								<span className="string">'@aperture/core'</span>
								;
							</div>
							<div className="code-line empty"></div>
							<div className="code-line comment">
								// TODO: Credentials check. Throws Error on
								Fail.
							</div>
							<div className="code-line">
								<span className="keyword">export const</span>{" "}
								<span className="function">auth</span> ={" "}
								<span className="keyword">async</span> (){" "}
								<span className="arrow">=&gt;</span> &#123;
							</div>

							<div className="code-block-content">
								{activeTab === "signup" && (
									<div className="input-line">
										<label className="variable">
											username:
										</label>
										<input
											type="text"
											name="username"
											className={`code-input string ${
												errors.username
													? "error-squiggly"
													: ""
											}`}
											placeholder='"Display Name"'
											autoComplete="off"
											onChange={handleInputChange}
										/>
										<span className="semicolon">,</span>
									</div>
								)}

								<div className="input-line">
									<label className="variable">email:</label>
									<input
										type="email"
										name="email"
										className={`code-input string ${
											errors.email ? "error-squiggly" : ""
										}`}
										placeholder='"user@example.com"'
										autoComplete="off"
										onChange={handleInputChange}
									/>
									<span className="semicolon">,</span>
								</div>

								<div className="input-line">
									<label className="variable">
										password:
									</label>
									<input
										type="password"
										name="password"
										className={`code-input variable ${
											errors.password
												? "error-squiggly"
												: ""
										}`}
										placeholder='"********"'
										onChange={handleInputChange}
									/>
									<span className="semicolon">;</span>
								</div>

								<div className="code-line empty"></div>
								<div className="code-line">
									<span className="keyword">return</span>{" "}
									<span className="function">
										UserSession
									</span>
									.<span className="function">init</span>();
								</div>
							</div>
							<div className="code-line">&#125;;</div>

							<div className="action-area">
								<button type="submit" className="debug-btn">
									<span className="play-icon">▶</span>{" "}
									{activeTab === "login"
										? "RUN_DEBUG"
										: "BUILD_USER"}
								</button>
							</div>
						</form>
					</div>

					{/* Bottom Panel (Terminal / Problems) */}
					<div className="ide-bottom-panel">
						<div className="panel-header">
							<span
								className={
									activePanel === "problems"
										? "active-tab"
										: ""
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
									activePanel === "terminal"
										? "active-tab"
										: ""
								}
								onClick={() => setActivePanel("terminal")}
							>
								TERMINAL
							</span>
							<span>OUTPUT</span>
						</div>

						<div className="panel-body">
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
											No problems have been detected in
											the workspace.
										</div>
									) : (
										Object.entries(errors).map(
											([field, msg], i) => (
												<div
													key={i}
													className="problem-item"
												>
													<span className="error-icon">
														ⓧ
													</span>
													<span className="error-msg">
														{msg}
													</span>
													<span className="error-loc">
														[{field}] Ln{" "}
														{activeTab === "signup"
															? i + 7
															: i + 6}
														, Col 12
													</span>
												</div>
											)
										)
									)}
								</div>
							)}
						</div>
					</div>

					{/* Status Bar */}
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
