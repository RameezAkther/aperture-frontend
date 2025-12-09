import { useState } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { LeftSection } from "./components/LeftSection/LeftSection";
import { Workspace } from "./components/Workspace/Workspace";
import { Auth } from "./components/Auth/Auth"; // Import the new Creative Auth
import "./App.css";

function App() {
	// State to track if user is authenticated
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Handler to simulate login
	const handleLogin = () => {
		// In real app, validate logic here
		setIsAuthenticated(true);
	};

	if (!isAuthenticated) {
		return <Auth onLogin={handleLogin} />;
	}

	return (
		<div className="app-container">
			{/* 1. Navigation Sidebar (Fixed Left) */}
			<Sidebar />

			{/* 2. Main Content Wrapper */}
			<main className="main-content-area">
				{/* A. Middle Panel (Assets/Session) */}
				<LeftSection />

				{/* B. Right Panel (The Chat Workspace) */}
				<div className="workspace-wrapper">
					<Workspace />
				</div>
			</main>
		</div>
	);
}

export default App;
