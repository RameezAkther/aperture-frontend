import React, { useState, useEffect, useRef } from "react";

interface AuthEditorProps {
	activeTab: "login" | "signup" | "recovery";
	errors: { [key: string]: string };
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: React.FormEvent) => void;
	isLoading: boolean;
	switchTab: (tab: "login" | "signup" | "recovery") => void;
	formData: any; // Used for image preview
}

export const AuthEditor: React.FC<AuthEditorProps> = ({
	activeTab,
	errors,
	handleInputChange,
	handleFileUpload,
	handleSubmit,
	isLoading,
	switchTab,
	formData,
}) => {
	// Local UI State
	const [showPassword, setShowPassword] = useState(false);

	// Refs for focus management
	const firstInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Auto-focus the first input when the tab changes
	useEffect(() => {
		if (firstInputRef.current) {
			firstInputRef.current.focus();
		}
	}, [activeTab]);

	// Helper: Render line numbers with error indicators
	const renderLineNumber = (num: number, fieldName?: string) => {
		const hasError = fieldName && errors[fieldName];
		return (
			<div className="line-num-wrapper" key={num}>
				{num}
				{hasError && <span className="gutter-error"></span>}
			</div>
		);
	};

	// Helper: Generate line numbers array dynamically
	const getLineNumbers = () => {
		let count = 12; // Default for Login
		if (activeTab === "signup") count = 16;
		if (activeTab === "recovery") count = 10;
		return Array.from({ length: count }, (_, i) => i + 1);
	};

	return (
		<div className="ide-editor">
			{/* --- LEFT GUTTER (Line Numbers) --- */}
			<div className="line-numbers">
				{getLineNumbers().map((n) => {
					// Map specific lines to fields for the red error dot
					let field: string | undefined;

					if (activeTab === "signup") {
						if (n === 7) field = "username";
						if (n === 8) field = "email";
						if (n === 9) field = "password";
						if (n === 6) field = "avatar"; // Optional: flag image errors on line 6
					} else if (activeTab === "login") {
						if (n === 7) field = "email";
						if (n === 8) field = "password";
					} else if (activeTab === "recovery") {
						if (n === 7) field = "email";
					}

					return renderLineNumber(n, field);
				})}
			</div>

			{/* --- MAIN CODE AREA --- */}
			<form className="code-area" onSubmit={handleSubmit}>
				{/* 1. Imports */}
				<div className="code-line">
					<span className="keyword">import</span>{" "}
					<span className="variable">UserSession</span>{" "}
					<span className="keyword">from</span>{" "}
					<span className="string">'@aperture/core'</span>;
				</div>

				{/* 2. Comments / Mode Indicators */}
				{activeTab === "recovery" ? (
					<div className="code-line comment">
						// INITIATING RECOVERY PROTOCOL...
					</div>
				) : (
					<div
						className="code-line comment clickable-comment"
						onClick={() => setShowPassword(!showPassword)}
						title="Click to toggle password visibility"
					>
						{`// [${
							showPassword ? "x" : " "
						}] show_literals (toggle visibility)`}
					</div>
				)}

				<div className="code-line empty"></div>

				{/* 3. Forgot Password Link (Login Mode Only) */}
				{activeTab === "login" && (
					<div
						className="code-line comment clickable-comment"
						onClick={() => switchTab("recovery")}
					>
						{`// Forgot credentials? Run recover_password()`}
					</div>
				)}

				{/* 4. Function Definition */}
				<div className="code-line">
					<span className="keyword">export const</span>{" "}
					<span className="function">
						{activeTab === "recovery" ? "reset" : "auth"}
					</span>{" "}
					= <span className="keyword">async</span> (){" "}
					<span className="arrow">=&gt;</span> &#123;
				</div>

				<div className="code-block-content">
					{/* --- A. AVATAR UPLOAD (Signup Only) --- */}
					{activeTab === "signup" && (
						<div className="input-line">
							<label className="variable">const avatar =</label>

							{/* Hidden File Input */}
							<input
								type="file"
								ref={fileInputRef}
								style={{ display: "none" }}
								accept="image/*"
								onChange={handleFileUpload}
							/>

							{/* Trigger Text */}
							<span
								className="string clickable-string"
								onClick={() => fileInputRef.current?.click()}
								style={{
									cursor: "pointer",
									textDecoration: "underline",
								}}
								title="Click to upload profile picture"
							>
								{formData.avatar
									? "'[IMAGE_BINARY_DATA]'"
									: "require('./assets/profile.png')"}
							</span>

							{/* Image Preview */}
							{formData.avatar && (
								<img
									src={formData.avatar}
									alt="avatar preview"
									style={{
										height: "20px",
										width: "20px",
										marginLeft: "10px",
										borderRadius: "4px",
										verticalAlign: "middle",
										border: "1px solid #444",
									}}
								/>
							)}
							<span className="semicolon">;</span>
						</div>
					)}

					{/* --- B. USERNAME (Signup Only) --- */}
					{activeTab === "signup" && (
						<div className="input-line">
							<label className="variable">username:</label>
							<input
								type="text"
								name="username"
								className={`code-input string ${
									errors.username ? "error-squiggly" : ""
								}`}
								placeholder='"Display Name"'
								autoComplete="off"
								onChange={handleInputChange}
								disabled={isLoading}
							/>
							<span className="semicolon">,</span>
						</div>
					)}

					{/* --- C. EMAIL (All Modes) --- */}
					<div className="input-line">
						<label className="variable">email:</label>
						<input
							ref={firstInputRef}
							type="email"
							name="email"
							className={`code-input string ${
								errors.email ? "error-squiggly" : ""
							}`}
							placeholder='"user@example.com"'
							autoComplete="email"
							onChange={handleInputChange}
							disabled={isLoading}
						/>
						<span className="semicolon">,</span>
					</div>

					{/* --- D. PASSWORD (Login & Signup Only) --- */}
					{activeTab !== "recovery" && (
						<div className="input-line">
							<label className="variable">password:</label>
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								className={`code-input variable ${
									errors.password ? "error-squiggly" : ""
								}`}
								placeholder={
									showPassword
										? '"password123"'
										: '"********"'
								}
								onChange={handleInputChange}
								disabled={isLoading}
							/>
							<span className="semicolon">;</span>
						</div>
					)}

					{/* 5. Return Statement */}
					<div className="code-line empty"></div>
					<div className="code-line">
						<span className="keyword">return</span>{" "}
						<span className="function">
							{activeTab === "recovery"
								? "System.sendLink(email)"
								: "UserSession.init()"}
						</span>
						;
					</div>
				</div>

				{/* 6. Closing Brace */}
				<div className="code-line">&#125;;</div>

				{/* 7. Action Buttons */}
				<div className="action-area">
					<button
						type="submit"
						className="debug-btn"
						disabled={isLoading}
					>
						<span className="play-icon">▶</span>{" "}
						{isLoading
							? "EXECUTING..."
							: activeTab === "recovery"
							? "SEND_LINK"
							: activeTab === "login"
							? "RUN_DEBUG"
							: "BUILD_USER"}
					</button>

					{/* Cancel Button for Recovery Mode */}
					{activeTab === "recovery" && (
						<button
							type="button"
							className="cancel-btn"
							onClick={() => switchTab("login")}
							style={{
								marginLeft: "10px",
								background: "transparent",
								border: "1px solid #444",
								color: "#666",
							}}
						>
							// CANCEL
						</button>
					)}
				</div>
			</form>
		</div>
	);
};
