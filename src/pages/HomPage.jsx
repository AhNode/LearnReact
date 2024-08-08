import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate("/upload");
	}, [navigate]);

	return null; // Return null since this page is only for redirection
}

export default HomePage;
