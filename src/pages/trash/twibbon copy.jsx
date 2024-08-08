import TwibbonEditor from "../../components/Fragments/TwibbonEditor/TwibbonEditor";
import Button from "../../components/Elements/Button";
import InputFile from "../../components/Elements/FileInput/indexs";
import Title from "../../components/Elements/Title";
import Canvas from "../../components/Elements/Canvas";
import { useRef, useState, useEffect } from "react";
import styles from "./styles/twibbonihbos.module.css";
import { useSearchParams } from "react-router-dom";
import IdNotFound from "../../components/Fragments/idNotFound";
import axios from "axios";

const images = import.meta.glob("../assets/person/*.jpg");
// import NotFound from "./pages/404";

export default function Twibbonihbos() {
	const editorRef = useRef(null);
	const [imageSrc, setImageSrc] = useState(
		`.../assets/person/person_deffault_1.jpg`
	);
	const [croppedImage, setCroppedImage] = useState(null);
	const [scale, setScale] = useState(1);
	const [twibbonImage, setTwibbonImage] = useState(null);
	const [twbOp, setTwbOp] = useState(1);
	const [searchParams] = useSearchParams();
	const searchQuery = searchParams.get("key");
	const twibbonUrl = `/uploads/${searchQuery}.png`;
	const [personImage, setPersonImage] = useState([]);
	const fetchDataRef = useRef(false);

	useEffect(() => {
		// Load all images into an array
		const loadImages = async () => {
			const imagePaths = Object.keys(images);
			const imagePromises = imagePaths.map(async (path) => {
				const module = await images[path]();
				return module.default; // or `module` depending on how the import is structured
			});
			const imageArray = await Promise.all(imagePromises);
			setPersonImage(imageArray);
			// console.log(imageArray);
			return imageArray;
		};

		loadImages().then((loadedImages) => {
			// Set a random image or use any logic to select an image
			const randomImage =
				loadedImages[Math.floor(Math.random() * loadedImages.length)];
			setImageSrc(randomImage);
		});
	}, []);

	useEffect(() => {
		if (fetchDataRef.current) return;

		fetchDataRef.current = true;

		axios
			.get(`http://pnode1.danbot.host:9279/view/${searchQuery}.png`, {
				responseType: "arraybuffer",
			})
			.then((response) => {
				const blob = new Blob([response.data], { type: "image/png" });
				const url = URL.createObjectURL(blob);
				setTwibbonImage(url);
				console.log("Successfully fetched");
			})
			.catch((error) => {
				if (error.name !== "CanceledError") {
					console.error("Error fetching image data:", error);
				}
			});
	}, [searchQuery]);

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

	const debounce = (func, delay) => {
		let timeoutId;
		return function () {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(func, delay);
		};
	};

	const handleSave = () => {
		if (editorRef.current) {
			const canvas = editorRef.current.getImage();
			const croppedImageUrl = canvas.toDataURL("image/jpg", 1.0); // Full quality
			setCroppedImage(croppedImageUrl);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			setImageSrc(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleEditorWheel = (e) => {
		if (e.deltaY > 0) {
			if (scale === 1) {
				return;
			} else {
				setScale((prevScale) => prevScale - 0.05);
			}
		} else {
			setScale((prevScale) => prevScale + 0.05);
		}
	};

	const handleClear = async () => {
		const randomIndex = Math.floor(Math.random() * personImage.length);
		setImageSrc(personImage[randomIndex]);
		setCroppedImage(randomIndex);

		// 	setImageSrc(null);
		// 	setCroppedImage(null);
		// }
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

		// Draw the cropped image on the canvas
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		// Draw the twibbon overlay on top
		ctx.drawImage(twibbon, 0, 0, canvas.width, canvas.height);

		return new Promise((resolve) => {
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(URL.createObjectURL(blob));
					} else {
						console.error("Failed to create blob");
					}
				},
				"image/jpeg",
				1.0
			);
		});
	};

	return (
		<>
			{searchQuery ? (
				<TwibbonEditor
					setTwbOp={setTwbOp}
					setCroppedImage={setCroppedImage}
					editorRef={editorRef}
					setScale={setScale}
				>
					<Title
						title="Twibbon Maker by Joko"
						subtitle="Input your image here"
						width={300}
					/>
					<InputFile
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						widthIn="100px"
						placeholder="Upload Image"
						height="10px"
					/>
					<Canvas
						ref={editorRef}
						imageSrc={imageSrc}
						twibbonImage={twibbonImage}
						onWheel={handleEditorWheel}
						twbOp={twbOp}
						scale={scale}
						width={300}
						height={300}
						border={0}
						crossOrigin="anonymous"
					/>
					<div className={styles.buttonContainer} style={{ width: 300 }}>
						<Button onClick={handleClear}>Clear</Button>
						<Button onClick={handleDownload}>Download</Button>
					</div>
				</TwibbonEditor>
			) : (
				<IdNotFound />
			)}
		</>
	);
}
