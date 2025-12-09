import { useState, useEffect } from "react";

// CONFIGURATION
const API_BASE_URL = "http://localhost:8000/api/v1/auth";

interface UseAuthLogicProps {
	onLogin: () => void;
}

interface User {
	username: string;
	email: string;
	avatar?: string;
}

export const useAuthLogic = ({ onLogin }: UseAuthLogicProps) => {
	// UI State
	const [activeTab, setActiveTab] = useState<"login" | "signup" | "recovery">(
		"login"
	);
	const [activePanel, setActivePanel] = useState<"terminal" | "problems">(
		"terminal"
	);
	const [isLoading, setIsLoading] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		username: "",
		avatar: "", // Base64 string for profile picture
	});

	// Validation & Logs
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [terminalLogs, setTerminalLogs] = useState<string[]>([
		"Initializing Aperture Security Protocol...",
		"Loading language server...",
		"Connection established: gateway@localhost:8000",
	]);

	// --- 1. HELPER FUNCTIONS ---

	const log = (message: string) => {
		setTerminalLogs((prev) => [...prev, message]);
	};

	const clearLogs = () => {
		setTerminalLogs(["root@aperture:~$ console cleared"]);
	};

	const [user, setUser] = useState<User | null>(null);

	// --- 2. AUTO-LOGIN CHECK ---

	useEffect(() => {
		const checkSession = async () => {
			const token = localStorage.getItem("access_token");
			if (!token) return;

			log("> Detected existing session context. Verifying...");
			setIsLoading(true);

			try {
				const res = await fetch(`${API_BASE_URL}/profile`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (res.ok) {
					const data = await res.json();
					log("> Session verified. Restoring workspace...");
					if (data.data) {
						setUser({
							username: data.data.username,
							email: data.data.email,
							avatar: data.data.avatar, // Ensure backend sends this
						});
					}
					setTimeout(onLogin, 800);
				} else {
					log(
						"> [WARN] Session token invalid or expired. Purging context."
					);
					localStorage.removeItem("access_token");
					localStorage.removeItem("refresh_token");
					setIsLoading(false);
				}
			} catch (e) {
				log("> [ERROR] Failed to reach auth server.");
				setIsLoading(false);
			}
		};

		checkSession();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// --- 3. INPUT HANDLING & VALIDATION ---

	// "Linter" Logic (Client-side validation)
	const validateField = (name: string, value: string) => {
		let errorMsg = "";

		if (name === "email") {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value) && value.length > 0)
				errorMsg = "Type 'string' is not assignable to type 'Email'.";
		}

		if (name === "password" && activeTab !== "recovery") {
			// 1. Length Check
			if (value.length < 8 && value.length > 0) {
				errorMsg = "Buffer underflow: Minimal length of 8 required.";
			}
			// 2. Uppercase Check
			else if (!/[A-Z]/.test(value) && value.length > 0) {
				errorMsg = "Syntax Error: Missing uppercase constant (A-Z).";
			}
			// 3. Lowercase Check
			else if (!/[a-z]/.test(value) && value.length > 0) {
				errorMsg = "Syntax Error: Missing lowercase literal (a-z).";
			}
			// 4. Number Check
			else if (!/[0-9]/.test(value) && value.length > 0) {
				errorMsg =
					"Type Mismatch: Expected at least one numeric value.";
			}
			// 5. Special Character Check
			else if (
				!/[!@#$%^&*(),.?":{}|<>]/.test(value) &&
				value.length > 0
			) {
				errorMsg = "Unhandled Exception: Special character required.";
			}
		}

		if (name === "username" && activeTab === "signup") {
			if (value.length < 3 && value.length > 0)
				errorMsg = "Identifier expected to be > 3 chars.";
			// Optional: Check for valid variable naming conventions (no spaces)
			if (/\s/.test(value)) {
				errorMsg =
					"Invalid Token: Whitespace is not allowed in identifiers.";
			}
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

	// Handle Image Upload & Convert to Base64
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 2MB Limit
		if (file.size > 2 * 1024 * 1024) {
			setErrors((prev) => ({
				...prev,
				avatar: "File size exceeds 2MB limit.",
			}));
			setActivePanel("problems");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setFormData((prev) => ({
				...prev,
				avatar: reader.result as string,
			}));
			// Clear avatar errors if any
			setErrors((prev) => {
				const newErr = { ...prev };
				delete newErr.avatar;
				return newErr;
			});
			log(
				`> Loaded resource: ${file.name} (${(file.size / 1024).toFixed(
					1
				)} KB)`
			);
		};
		reader.readAsDataURL(file);
	};

	// --- 4. FORM SUBMISSION ---

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isLoading) return;

		// A. Client-Side Checks (Compiler)
		const newErrors: { [key: string]: string } = {};
		if (!formData.email)
			newErrors.email = "Argument 'email' cannot be undefined.";

		if (activeTab !== "recovery") {
			if (!formData.password)
				newErrors.password = "Argument 'password' cannot be undefined.";
		}

		if (activeTab === "signup" && !formData.username)
			newErrors.username = "Argument 'username' cannot be undefined.";

		if (
			Object.keys(newErrors).length > 0 ||
			Object.keys(errors).length > 0
		) {
			setErrors((prev) => ({ ...prev, ...newErrors }));
			setActivePanel("problems");
			log(
				`> [ERROR] Build failed with ${
					Object.keys(newErrors).length + Object.keys(errors).length
				} errors.`
			);
			return;
		}

		// B. API Request
		setIsLoading(true);
		setActivePanel("terminal");

		// Determine Endpoint
		let endpoint = "/login";
		if (activeTab === "signup") endpoint = "/register";
		if (activeTab === "recovery") endpoint = "/forgot-password";

		log(`> Compiling payload for ${endpoint}...`);
		log(`> POST ${API_BASE_URL}${endpoint} [PENDING]`);

		try {
			// Construct Payload
			let payload: any = { email: formData.email };

			if (activeTab === "login") {
				payload.password = formData.password;
			} else if (activeTab === "signup") {
				payload = {
					username: formData.username,
					email: formData.email,
					password: formData.password,
					avatar: formData.avatar, // Send Base64
					auth_provider: "email",
				};
			}
			// Recovery uses only email

			const response = await fetch(`${API_BASE_URL}${endpoint}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				// C. Smart Error Mapping (Backend -> UI)
				let errorText = "Unknown Error";
				let errorField = "";

				if (data.detail) {
					if (typeof data.detail === "string") {
						errorText = data.detail;
					} else if (data.detail.message) {
						errorText = data.detail.message;
						// Heuristic mapping
						const lowerMsg = errorText.toLowerCase();
						if (
							lowerMsg.includes("email") ||
							lowerMsg.includes("user not found")
						)
							errorField = "email";
						if (lowerMsg.includes("username"))
							errorField = "username";
						if (
							lowerMsg.includes("password") ||
							lowerMsg.includes("credential")
						)
							errorField = "password";
					}
				}

				if (errorField) {
					setErrors((prev) => ({ ...prev, [errorField]: errorText }));
					setActivePanel("problems");
				}

				throw new Error(`[${response.status}] ${errorText}`);
			}

			// D. Success Handling
			log(`> ${response.status} OK. Operation successful.`);

			if (activeTab === "recovery") {
				log(
					`> Reset link sent to ${formData.email}. Check your inbox.`
				);
				setIsLoading(false);
				// Optional: Switch back to login after delay
				setTimeout(() => switchTab("login"), 4000);
				return;
			}

			// Store Tokens
			if (data.tokens) {
				localStorage.setItem("access_token", data.tokens.access_token);
				localStorage.setItem(
					"refresh_token",
					data.tokens.refresh_token
				);
				log(`> Session context saved to local storage.`);
			}

			log(`> Executing login sequence...`);
			setTimeout(onLogin, 1000);
		} catch (err: any) {
			log(`> [FATAL] Runtime Exception: ${err.message}`);
			setIsLoading(false);
		}
	};

	const switchTab = (tab: "login" | "signup" | "recovery") => {
		setActiveTab(tab);
		setErrors({});
		// Clear sensitive fields when switching, but keep email if possible for UX
		setFormData((prev) => ({
			...prev,
			password: "",
			username: prev.username,
		}));
		log(`> Context switched to ${tab}.tsx`);
	};

	const logout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		setUser(null);
		log("> Session terminated. Local storage cleared.");
		setActiveTab("login");
	};

	return {
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
		user, // <--- Export this
		logout,
	};
};
