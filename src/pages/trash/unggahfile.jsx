import React, { useRef, useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";

const CropImage = () => {
	const editorRef = useRef(null);
	const [imageSrc, setImageSrc] = useState(null);
	const [croppedImage, setCroppedImage] = useState(null);
	const [scale, setScale] = useState(1);
	const [twibbonImage, setTwibbonImage] = useState(null);
	const [twbOp, setTwbOp] = useState(1);
	const [isLoading, setIsLoading] = useState(true); // Loading state
	const twibbonUrl = "/images/twbMatsama.png";
	const lastTouchDistance = useRef(null);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return; // Check if a file was selected
		const reader = new FileReader();
		reader.onload = () => {
			setImageSrc(reader.result);
			console.log("Image loaded:", reader.result); // Debugging log
		};
		reader.readAsDataURL(file);
	};

	const debounce = (func, delay) => {
		let timeoutId;
		return function () {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(func, delay);
		};
	};

	const handleScaleChange = (e) => {
		const scale = parseFloat(e.target.value);
		setScale(scale);
	};

	const handleSave = () => {
		if (editorRef.current) {
			const canvas = editorRef.current.getImage();
			const croppedImageUrl = canvas.toDataURL("image/jpg", 1.0); // Full quality
			setCroppedImage(croppedImageUrl);
			console.log("Cropped image saved:", croppedImageUrl); // Debugging log
		}
	};

	const handleClear = () => {
		setImageSrc(null);
		setCroppedImage(null);
	};

	const handleEditorWheel = (e) => {
		e.preventDefault(); // Prevent the default zoom behavior

		if (e.deltaY > 0) {
			if (scale > 1) {
				setScale((prevScale) => prevScale - 0.05);
			}
		} else {
			setScale((prevScale) => prevScale + 0.05);
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

	useEffect(() => {
		const handleWheelStop = debounce(() => {
			setTwbOp(1);
			handleSave();
		}, 300);

		window.addEventListener("wheel", handleWheelStop);

		return () => {
			window.removeEventListener("wheel", handleWheelStop);
		};
	}, []);

	useEffect(() => {
		const fetchTwibbonImage = async () => {
			try {
				const response = await fetch(twibbonUrl);
				if (!response.ok) {
					throw new Error("Failed to fetch twibbon image");
				}
				const blob = await response.blob();
				setTwibbonImage(URL.createObjectURL(blob));
				setIsLoading(false); // Stop loading when the twibbon image is loaded
			} catch (error) {
				console.error("Error fetching twibbon image:", error);
			}
		};

		fetchTwibbonImage();
	}, [twibbonUrl]);

	const getCroppedImg = async () => {
		if (!imageSrc || !croppedImage) {
			return;
		}

		const image = new Image();
		image.src = croppedImage;

		const twibbon = new Image();
		twibbon.src = twibbonImage;

		await Promise.all([
			new Promise((resolve, reject) => {
				image.onload = () => resolve();
				image.onerror = reject;
			}),
			new Promise((resolve, reject) => {
				twibbon.onload = () => resolve();
				twibbon.onerror = reject;
			}),
		]);

		const canvas = document.createElement("canvas");
		canvas.width = 1080;
		canvas.height = 1080;
		const ctx = canvas.getContext("2d");

		// Draw the cropped image on the canvas with the appropriate scale
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		// Draw the twibbon overlay on top
		ctx.drawImage(twibbon, 0, 0, canvas.width, canvas.height);

		return new Promise((resolve) => {
			canvas.toBlob(
				(blob) => {
					resolve(URL.createObjectURL(blob));
				},
				"image/jpeg",
				1.0
			); // Full quality
		});
	};

	const handleDownload = async () => {
		const finalImageUrl = await getCroppedImg();
		if (finalImageUrl) {
			const link = document.createElement("a");
			link.href = finalImageUrl;
			link.download = "twibboned-image.jpeg";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	useEffect(() => {
		if (!editorRef.current || !imageSrc) return;

		const editor = editorRef.current;
		const canvas = editor.getImage(); // Access the canvas element

		if (!canvas) return; // Ensure canvas is available

		const options = { passive: false }; // Set passive to false
		canvas.addEventListener("wheel", handleEditorWheel, options);

		return () => {
			canvas.removeEventListener("wheel", handleEditorWheel, options);
		};
	}, [editorRef.current, imageSrc]); // Only run when editorRef or imageSrc changes

	return (
		<>
			<div
				onMouseUp={() => {
					setTwbOp(1);
					handleSave();
				}}
				onMouseDown={() => {
					setTwbOp(0.5);
				}}
				onWheelCapture={() => {
					setTwbOp(0.5);
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={() => {
					setTwbOp(1);
				}}
				className="crop-container"
			>
				{/* Show loading animation */}
				<>
					<div
						className="sectionTitle"
						style={{
							width: "300px",
							marginBottom: "20px",
						}}
					>
						<h1
							style={{
								fontSize: "23px",
								fontWeight: "bold",
							}}
						>
							Twibbon Maker by Joko
						</h1>
						<p
							style={{
								fontSize: "14px",
							}}
						>
							Upload your image below
						</p>
					</div>
					<input type="file" accept="image/*" onChange={handleFileChange} />
					<br />
					<>
						<div
							style={{
								position: "relative",
								width: "300px",
								height: "300px",
							}}
							className="image-editor-container"
						>
							{imageSrc && (
								<AvatarEditor
									ref={editorRef}
									image={imageSrc}
									width={300}
									height={300}
									border={0}
									scale={scale}
									rotate={0}
									crossOrigin="anonymous"
								/>
							)}
							{twibbonImage && (
								<img
									src={twibbonImage}
									alt="Twibbon"
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										pointerEvents: "none",
										opacity: twbOp,
									}}
								/>
							)}
						</div>
						<br />
						<div className="button-container">
							<button onClick={handleClear}>Clear</button>
							<button onClick={handleDownload}>Download</button>
						</div>
					</>
				</>
			</div>
		</>
	);
};

export default CropImage;
