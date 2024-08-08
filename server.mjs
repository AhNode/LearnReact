import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import { nanoid } from "nanoid";

// Mengganti __dirname dan __filename dalam modul ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 80;

// Melayani file statis dari folder 'dist'
app.use(express.static(path.join(__dirname, "dist")));
app.use(
	cors({
		origin: "http://localhost:80", // Izinkan akses dari localhost:5173
		methods: ["GET", "POST"], // Izinkan metode HTTP yang diperlukan
		allowedHeaders: ["Content-Type"], // Izinkan header yang diperlukan
	})
);

// Menangani rute lainnya dan mengirimkan file 'index.html'
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// app.listen(port, () => {
// 	console.log(`Server is running on http://localhost:${port}`);
// });

// Middleware CORS

// Set storage engine
const storage = multer.diskStorage({
	destination: "./public/uploads/",
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

app.listen(port, () =>
	console.log(`Server started on http://localhost:${port}`)
);
