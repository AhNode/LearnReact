import InputFrom from "../Elements/Input/Index";
import Button from "../Elements/Button";

export default function FromLogin() {
	const handleLogin = (event) => {
		event.preventDefault();
		localStorage.setItem("email", event.target.email.value);
		localStorage.setItem("password", event.target.password.value);
		window.location.href = "/products";
	};
	return (
		<form action="" onSubmit={handleLogin}>
			<InputFrom
				title="Email"
				type="email"
				name="email"
				placeholder="example@gmail.com"
			/>
			<InputFrom
				title="Password"
				type="password"
				name="password"
				placeholder="*******"
			/>
			<Button classname="bg-blue-400 w-full text-white" type="submit">
				Login
			</Button>
		</form>
	);
}
