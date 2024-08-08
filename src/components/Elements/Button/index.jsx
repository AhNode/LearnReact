const Button = (props) => {
	const {
		classname,
		children,
		onClick = () => {},
		type,
		width = "100%",
	} = props;
	return (
		<button
			className={`h-10 px-6 font-semibold rounded-md ${classname} `}
			type={type}
			onClick={onClick}
			style={{ width }}
		>
			{console.log(width)}
			{children}
		</button>
	);
};

export default Button;
