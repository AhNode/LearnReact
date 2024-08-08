import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware CORS
app.use(
	cors({
		origin: "http://localhost:5173", // Izinkan akses dari localhost:5173
		methods: ["GET", "POST"], // Izinkan metode HTTP yang diperlukan
		allowedHeaders: ["Content-Type"], // Izinkan header yang diperlukan
	})
);

// Set storage engine
const storage = multer.diskStorage({
	destination: "./uploads/",
	filename: (req, file, cb) => {
		const uniqueId = nanoid(9); // Menghasilkan ID unik dengan panjang 9 karakter
		cb(null, uniqueId + path.extname(file.originalname));
	},
});

// Init upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 }, // Limit files to 1MB
	fileFilter: (req, file, cb) => {
		const filetypes = /png/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);

		if (mimetype && extname) {
			return cb(null, true);
		} else {
			cb(new Error("Only images.png are allowed!"));
		}
	},
}).single("file");

// Create uploads folder if it doesn't exist
if (!fs.existsSync("./uploads")) {
	fs.mkdirSync("./uploads");
}

// Upload route
app.post("/upload/data", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(400).send({ message: err.message });
		} else {
			if (req.file === undefined) {
				res.status(400).send({ message: "No file selected!" });
			} else {
				const uniqueId = req.file.filename.split(".")[0];
				res.status(200).send({
					message: "File uploaded successfully",
					twibbonId: uniqueId, // Kirim ID unik
					fileName: req.file.filename,
				});
			}
		}
	});
});

app.listen(PORT, () =>
	console.log(`Server started on http://localhost:${PORT}`)
);
