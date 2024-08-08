import InputFrom from "../Elements/Input/Index";
import Button from "../Elements/Button";

export default function FromLogin() {
	return (
		<form action="">
			<InputFrom
				title="Username"
				type="text"
				name="username"
				placeholder="Insert your udername..."
			/>
			<InputFrom
				title="Email"
				type="email"
				name="email"
				placeholder="example@gmail.com"
			/>
			<InputFrom
				title="Password"
				type="password"
				name="passsword"
				placeholder="*******"
			/>
			<InputFrom
				title="Confirm Password"
				type="password"
				name="confirmPassword"
				placeholder="*******"
			/>
			<Button classname="bg-blue-400 w-full text-white">Regristasi</Button>
		</form>
	);
}
