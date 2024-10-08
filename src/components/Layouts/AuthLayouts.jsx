import { Link } from "react-router-dom";

export default function AuthLayouts(props) {
	const { children, title, type } = props;
	return (
		<div className="App flex justify-center min-h-screen items-center">
			<div className="w-full max-w-xs">
				<h1 className="text-3xl font-bold mb-2 text-blue-600">{title}</h1>
				<p className="font-medium text-slate-500 mb-8">
					Welcome, Please enter your details
				</p>
				{children}
				<p className="text-sm mt-10 text-center">
					{type === "login"
						? "Don't have an account? "
						: "Already have an account? "}
					{type === "login" && (
						<Link to="/register" className="font-bold text-blue-600">
							Sign Up
						</Link>
					)}
					{type === "register" && (
						<Link to="/login" className="font-bold text-blue-600">
							Sign In
						</Link>
					)}
				</p>
			</div>
		</div>
	);
}

//Optional Navigation
const Navigation = ({ type }) => {
	if (type === "login") {
		<p className="text-sm mt-10 text-center">
			Don't have an account?{" "}
			<Link to="/register" className="font-bold text-blue-600">
				Sign Up
			</Link>
		</p>;
	} else {
		<p className="text-sm mt-10 text-center">
			Already have an account?{" "}
			<Link to="/login" className="font-bold text-blue-600">
				Sing In
			</Link>
		</p>;
	}
};
