export default function Input(props) {
	const { type, name, placeholder } = props;
	return (
		<input
			type={type}
			className="text-sm border rounded 2-full py-2 px-2 text-slate-700 placeholder: opacity-60 w-full"
			placeholder={placeholder}
			name={name}
			id={name}
		/>
	);
}
