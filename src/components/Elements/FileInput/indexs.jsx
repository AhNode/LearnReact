import styles from "./FileInput.module.css";
import { forwardRef } from "react";

export default forwardRef(function InputFile(props, ref) {
	const {
		type,
		accept,
		onChange = () => {},
		placeholder,
		width,
		display,
	} = props;

	return (
		<div>
			<input
				ref={ref}
				className={styles.InputFile}
				style={{
					width,
					display,
				}}
				type={type}
				accept={accept}
				onChange={(e) => {
					onChange(e);
				}}
				placeholder={placeholder}
			/>
		</div>
	);
});
