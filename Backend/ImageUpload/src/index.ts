import express, {Request, Response} from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import dayjs from "dayjs";
import gitConfig = require('../../../config/github-config.json');

interface GithubConfig {
    username: string;
    password: string;
    token: string;
}

const configData: GithubConfig = gitConfig;

const app = express();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Ungültiger Dateityp. Erlaubt sind nur JPEG, PNG oder WEBP."));
        }
    },
    limits: {fileSize: 5 * 1024 * 1024},
});

app.post("/upload", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
    console.log("File im Request:", req.file);
    console.log("Body:", req.body);

    if (!req.file) {
        res.status(400).send("Keine Datei hochgeladen.");
        return;
    }

    const compressedFile = await processImage(req.file);
    console.log("Compressed file:", compressedFile);

    try {
        const timestamp = dayjs().format("YYYY-MM-DD-HH-mm-ss");
        const fileExtension = path.extname(compressedFile.originalname);
        const newFileName = `${timestamp}${fileExtension}`;

        const githubApiUrl = `https://api.github.com/repos/Software-Engineering-I-HWR/GourmetGuidePictures/contents/${newFileName}`;

        const response = await fetch(githubApiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${configData.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Upload ${newFileName}`,
                content: compressedFile.buffer.toString("base64"),
            }),
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Hochladen zu GitHub: ${response.statusText}`);
        }

        const responseData = await response.json();

        res.status(200).json({
            gitUrl: responseData.content.download_url
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Fehler beim Verarbeiten der Datei.");
    }
});

async function processImage(file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}) {
    try {
        const jpegBuffer = await sharp(file.buffer)
            .toFormat("jpeg")
            .jpeg({quality: 80})
            .toBuffer();

        let quality = 80;
        let compressedBuffer = jpegBuffer;

        while (compressedBuffer.length > 2 * 1024 * 1024 && quality > 10) {
            quality -= 10;
            compressedBuffer = await sharp(file.buffer)
                .jpeg({quality})
                .toBuffer();
        }

        return {
            buffer: compressedBuffer,
            size: compressedBuffer.length,
            mimetype: 'image/jpeg',
            originalname: file.originalname.replace(/\.[^.]+$/, '.jpg'),
        };
    } catch (error) {
        console.error('Fehler bei der Bildverarbeitung:', error);
        throw error;
    }
}

app.listen(5000, () => {
    console.log("HTTP-Server läuft auf http://localhost:5000");
});