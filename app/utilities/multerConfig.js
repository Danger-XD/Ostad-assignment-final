import fs from 'fs';
import multer from 'multer';
import path from 'path';
// import { fileURLToPath } from 'url';


// Handle __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Use a temporary directory (for serverless environments like Vercel)
const uploadDir = path.join('/tmp', 'uploads');
//path.join(__dirname, '../../uploads') for local development
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
        console.error('Failed to create uploads directory:', err);
    }
}


// Set storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Directory where images will be saved
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Add timestamp to avoid overwriting files
    },
});

// File validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (ext && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed.'));
    }
};

export const upload = multer({ storage, fileFilter });
