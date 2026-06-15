import multer from "multer";
import { CATEGORIES } from "../models/Upload.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export function validateCategory(category) {
  return CATEGORIES.includes(category) ? category : "document";
}
