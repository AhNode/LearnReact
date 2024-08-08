import styles from "./Title.module.css";

export default function Title(props) {
	const { title, subtitle, width } = props;

	return (
		<div
			className={styles.container}
			style={{
				width,
			}}
		>
			<h1 className={styles.title}>{title}</h1>
			<p className={styles.subtitle}>{subtitle}</p>
		</div>
	);
}
