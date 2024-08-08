import AvatarEditor from "react-avatar-editor";
import styles from "./Canvas.module.css";
import { forwardRef } from "react";

export default forwardRef(function Canvasfor(props, ref) {
	const {
		imageSrc,
		width = 300,
		height = 300,
		border = 0,
		scale,
		onWheel = () => {},
		crossOrigin,
		twibbonImage,
		twbOp,
	} = props;

	return (
		<div
			className={styles.canvasArea}
			style={{
				width: `${width}px`,
				height: `${height}px`,
			}}
		>
			<AvatarEditor
				ref={ref}
				image={imageSrc}
				width={width}
				height={height}
				border={border}
				scale={scale}
				onWheel={onWheel}
				crossOrigin={crossOrigin}
			/>
			{twibbonImage && (
				<img
					src={twibbonImage}
					alt="Twibbon"
					className={styles.twibbonImage}
					style={{
						width: `${width}px`,
						height: `${height}px`,
						opacity: twbOp,
					}}
				/>
			)}
		</div>
	);
});
