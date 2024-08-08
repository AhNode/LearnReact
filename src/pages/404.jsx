import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();

	return (
		<div className="App flex justify-center min-h-screen items-center flex-col">
			<h1 className="text-3xl font-bold">Oops!</h1>
			<p className="my-2 text-xl">Sepertinya kamu nyasar di website ini</p>
			<p>{error.statusText || error.message}</p>
		</div>
	);
}
