import Label from "./Label.jsx";
import Input from "./Input.jsx";

export default function InputForm(props) {
	const { title, type, name, placeholder } = props;
	return (
		<div className="mb-6">
			<Label htmlFor={name}>{title}</Label>
			<Input name={name} type={type} placeholder={placeholder} />
		</div>
	);
}
