// TwibbonEditor.jsx
import { useRef } from "react";
import styles from "./TwibbonEditor.module.css";
export default function TwibbonEditor(props) {
	const { children, setTwbOp, setCroppedImage, editorRef, setScale } = props;
	const lastTouchDistance = useRef(null); // Moved here from Twibbonihbos

	const handleMouseUp = () => {
		setTwbOp(1);
		handleSave();
	};

	const handleMouseDown = () => {
		setTwbOp(0.5);
	};

	const handleWheel = () => {
		setTwbOp(0.5);
	};

	const handleTouchEnd = () => {
		setTwbOp(1);
	};

	const handleSave = () => {
		if (editorRef.current) {
			const canvas = editorRef.current.getImage();
			const croppedImageUrl = canvas.toDataURL("image/jpg", 1.0); // Full quality
			setCroppedImage(croppedImageUrl);
		}
	};

	const handleTouchStart = (e) => {
		if (e.touches.length === 2) {
			const touchDistance = Math.hypot(
				e.touches[0].pageX - e.touches[1].pageX,
				e.touches[0].pageY - e.touches[1].pageY
			);
			lastTouchDistance.current = touchDistance;
		}
		setTwbOp(0.5);
	};

	const handleTouchMove = (e) => {
		if (e.touches.length === 2) {
			const touchDistance = Math.hypot(
				e.touches[0].pageX - e.touches[1].pageX,
				e.touches[0].pageY - e.touches[1].pageY
			);
			const scaleChange = (touchDistance - lastTouchDistance.current) * 0.005;
			setScale((prevScale) => Math.max(1, prevScale + scaleChange));
			lastTouchDistance.current = touchDistance;
		}
	};

	return (
		<div
			onMouseUp={handleMouseUp}
			onMouseDown={handleMouseDown}
			onWheel={handleWheel}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			className={styles.container}
		>
			{children}
		</div>
	);
}
