import AuthLayouts from "../components/Layouts/AuthLayouts";
import FormRegister from "../components/Fragments/FormRegister";

export default function RegisterPage() {
	return (
		<AuthLayouts title="Register" type="register">
			<FormRegister />
		</AuthLayouts>
	);
}
