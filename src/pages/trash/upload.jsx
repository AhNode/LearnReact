import React, { useRef, useState } from "react";
import axios from "axios";
import styles from "../pages/styles/upload.module.css";
import Button from "../../components/Elements/Button";
import InputFile from "../../components/Elements/FileInput/indexs";
import Title from "../../components/Elements/Title";
import style from "../pages/styles/upload.module.css";

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState("sellect");
	const [twibbonId, setTwibbonId] = useState("");
	const [blobUrl, setBlobUrl] = useState(null);
	const [isCopied, setIsCopied] = useState(false);
	const [progress, setProgress] = useState();
	const [status, setStatus] = useState(false);
	const inputRef = useRef(null);

	const handlerClear = () => {
		inputRef.current.value = "";
		setFile(null);
		setProgress(0);
		setTwibbonId(null);
	};

	const onChooseFile = () => {
		inputRef.current.click();
	};

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			// Set the file state
			setFile(selectedFile);

			// Create a Blob URL
			const url = URL.createObjectURL(selectedFile);
			setBlobUrl(url);
		}
	};

	const handleUpload = () => {
		if (!file) {
			alert("Please select an image first.");
			return;
		}

		if (uploadStatus === "uploading" || uploadStatus === "done") {
			handlerClear();
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		axios
			.post("https://joko.localplayer.dev/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setUploadStatus("uploading");
					setProgress(percentCompleted);
				},
			})
			.then((response) => {
				setUploadStatus("done");
				setTwibbonId(response.data.imageId);
				console.log("Response:", response.data);
			})
			.catch((error) => {
				setUploadStatus("sellect");
				console.error("Error uploading image:", error);
			});
	};
	const handleCopy = async (url) => {
		// Ensure this is called from a button click to have document focus
		if (document.hasFocus()) {
			await navigator.clipboard.writeText(url).then(
				() => {
					console.log("Copied text to clipboard");
					setIsCopied(true); // Clear message after 2 seconds
				},
				(err) => {
					console.error("Failed to copy text", err);
					setIsCopied(false);
				}
			);
		}
	};

	return (
		<div className={styles.container}>
			<Title title="Twibbon Maker" subtitle="Made by MadJakii" width="300px" />
			<InputFile
				ref={inputRef}
				type="file"
				accept="image/png"
				display="none"
				onChange={handleFileChange}
			/>
			{file && (
				<>
					<div className={styles.fileCard}>
						<span className={`material-symbols-outlined ${styles.iconFile}`}>
							description
						</span>

						<div className={styles.fileInfo}>
							<div style={{ flex: 1 }}>
								<h6>{file.name}</h6>
								<div className={styles.progressBar}>
									<div
										className={styles.progress}
										style={{ width: `${progress}%` }}
									></div>
								</div>
							</div>

							<button
								className={style.deleteButton}
								onClick={() => {
									if (uploadStatus != "uploading") {
										handlerClear();
									}
								}}
							>
								{uploadStatus == "sellect" || uploadStatus == "uploading" ? (
									<span className="material-symbols-outlined">remove</span>
								) : (
									<span
										className={`material-symbols-outlined ${styles.checkIcon}`}
									>
										check
									</span>
								)}
							</button>
						</div>
					</div>
					<div className={styles.buttonContainerUpload}>
						<Button
							width="300px"
							onClick={handleUpload}
							className={styles.buttonUpload}
						>
							<span className="material-symbols-outlined">upload</span>
						</Button>
					</div>
				</>
			)}
			<div className={styles.buttonContainer}>
				{!file && (
					<Button className={styles.buttonContainer} onClick={onChooseFile}>
						Choose Image
					</Button>
				)}
			</div>
			{/* {uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>} */}
			{twibbonId && (
				<div className={styles.twibbonLink}>
					<Button
						className={styles.buttonContainer}
						onClick={() =>
							handleCopy(`http://localhost:5173/twibbon?key=${twibbonId}`)
						}
					>
						<span className="material-symbols-outlined">content_copy</span>
					</Button>
					{isCopied ? <p className={styles.copied}>Copied!</p> : null}
					<a href={`http://localhost:5173/twibbon?key=${twibbonId}`}>
						http://localhost:5173/ twibbon?key={twibbonId}
					</a>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
