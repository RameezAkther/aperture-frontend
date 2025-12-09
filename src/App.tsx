import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { LeftSection } from "./components/LeftSection/LeftSection";
import { Workspace } from "./components/Workspace/Workspace";
import { Auth } from "./components/Auth/Auth";
import { UserWidget } from "./components/Auth/UserWidget"; // <--- Import the Widget
import "./App.css";

// Define the User Shape
interface User {
	username: string;
	email: string;
	avatar?: string;
}

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	// 1. Auto-Login Logic (Runs on Refresh)
	useEffect(() => {
		const token = localStorage.getItem("access_token");
		if (token) {
			fetchUserProfile(token);
		}
	}, []);

	// 2. Fetch User Data Helper
	const fetchUserProfile = async (token: string) => {
		try {
			// Replace with your actual API URL
			const res = await fetch(
				"http://localhost:8000/api/v1/auth/profile",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (res.ok) {
				const data = await res.json();
				// Assuming backend returns { data: { username, email, avatar... } }
				if (data.data) {
					setUser(data.data);
					setIsAuthenticated(true);
				}
			} else {
				// If token is invalid (e.g., 401), force logout
				handleLogout();
			}
		} catch (error) {
			console.error("Failed to fetch profile:", error);
		}
	};

	// 3. Login Handler (Called by Auth component)
	const handleLogin = () => {
		// Auth.tsx has already saved the token to localStorage.
		// We just need to load the user data now.
		const token = localStorage.getItem("access_token");
		if (token) fetchUserProfile(token);
	};

	// 4. Logout Handler
	const handleLogout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		setUser(null);
		setIsAuthenticated(false);
	};

	// --- RENDER ---

	// A. Show Auth Screen if not logged in
	if (!isAuthenticated) {
		return <Auth onLogin={handleLogin} />;
	}

	// B. Show Main App if logged in
	return (
		<div className="app-container">
			{/* User Widget (Persistent Top-Right) */}
			<UserWidget
				user={user}
				onLogout={handleLogout}
				onLoginClick={() => {}} // No-op since we are already logged in
			/>

			{/* 1. Navigation Sidebar */}
			<Sidebar />

			{/* 2. Main Content Wrapper */}
			<main className="main-content-area">
				{/* A. Middle Panel */}
				<LeftSection />

				{/* B. Right Panel */}
				<div className="workspace-wrapper">
					<Workspace />
				</div>
			</main>
		</div>
	);
}

export default App;
