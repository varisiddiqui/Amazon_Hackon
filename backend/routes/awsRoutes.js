import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { uploadMiddleware, validateCategory } from "../middleware/upload.js";
import { isAwsConfigured, isSesConfigured } from "../config/aws.js";
import {
  uploadToS3,
  deleteFromS3,
  getPresignedUploadUrl,
  getPresignedDownloadUrl,
  checkS3Connection,
} from "../services/s3Service.js";
import { sendEmail, sendWelcomeEmail } from "../services/sesService.js";
import Upload from "../models/Upload.js";
import { findUserById } from "../services/authService.js";
import { analyzeResumeUpload } from "../store/index.js";

const router = Router();

/** AWS status check */
router.get("/status", authRequired, async (_req, res) => {
  const s3Status = await checkS3Connection();
  return res.json({
    ok: true,
    aws: {
      configured: isAwsConfigured(),
      s3: s3Status,
      ses: { configured: isSesConfigured() },
    },
  });
});

/** Get presigned URL for direct client → S3 upload */
router.post("/presign", authRequired, async (req, res) => {
  try {
    if (!isAwsConfigured()) {
      return res.status(503).json({ ok: false, error: "AWS S3 not configured" });
    }

    const { fileName, mimeType, category = "document" } = req.body;
    if (!fileName || !mimeType) {
      return res.status(400).json({ ok: false, error: "fileName and mimeType are required" });
    }

    const folder = validateCategory(category);
    const presigned = await getPresignedUploadUrl({
      fileName,
      mimeType,
      folder,
      userId: req.auth.id,
    });

    return res.json({ ok: true, data: presigned });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/** Upload file via backend → S3 */
router.post(
  "/upload",
  authRequired,
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      if (!isAwsConfigured()) {
        return res.status(503).json({ ok: false, error: "AWS S3 not configured" });
      }
      if (!req.file) {
        return res.status(400).json({ ok: false, error: "No file uploaded" });
      }

      const category = validateCategory(req.body.category || "document");
      const uploaded = await uploadToS3({
        buffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        folder: category,
        userId: req.auth.id,
      });

      const record = await Upload.create({
        userId: req.auth.id,
        ...uploaded,
        category,
      });

      return res.status(201).json({ ok: true, data: record.toPublicJSON() });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }
);

/** Upload resume + run analysis */
router.post(
  "/upload/resume",
  authRequired,
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      let fileRecord = null;

      if (isAwsConfigured() && req.file) {
        const uploaded = await uploadToS3({
          buffer: req.file.buffer,
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          folder: "resume",
          userId: req.auth.id,
        });

        fileRecord = await Upload.create({
          userId: req.auth.id,
          ...uploaded,
          category: "resume",
        });
      }

      const analysis = analyzeResumeUpload();

      return res.json({
        ok: true,
        data: {
          file: fileRecord?.toPublicJSON() || null,
          analysis,
          storedOnS3: Boolean(fileRecord),
        },
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }
);

/** Upload profile photo */
router.post(
  "/upload/profile",
  authRequired,
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      if (!isAwsConfigured()) {
        return res.status(503).json({ ok: false, error: "AWS S3 not configured" });
      }
      if (!req.file) {
        return res.status(400).json({ ok: false, error: "No file uploaded" });
      }

      const uploaded = await uploadToS3({
        buffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        folder: "profile",
        userId: req.auth.id,
      });

      const record = await Upload.create({
        userId: req.auth.id,
        ...uploaded,
        category: "profile",
      });

      return res.status(201).json({ ok: true, data: record.toPublicJSON() });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }
);

/** List current user's uploads */
router.get("/files", authRequired, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { userId: req.auth.id };
    if (category) filter.category = category;

    const files = await Upload.find(filter).sort({ createdAt: -1 });
    return res.json({
      ok: true,
      data: files.map((f) => f.toPublicJSON()),
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/** Get download URL for a file */
router.get("/files/:id/download", authRequired, async (req, res) => {
  try {
    const file = await Upload.findOne({ _id: req.params.id, userId: req.auth.id });
    if (!file) {
      return res.status(404).json({ ok: false, error: "File not found" });
    }

    if (!isAwsConfigured()) {
      return res.json({ ok: true, data: { url: file.url } });
    }

    const downloadUrl = await getPresignedDownloadUrl(file.key);
    return res.json({ ok: true, data: { url: downloadUrl } });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/** Delete file from S3 + DB */
router.delete("/files/:id", authRequired, async (req, res) => {
  try {
    const file = await Upload.findOne({ _id: req.params.id, userId: req.auth.id });
    if (!file) {
      return res.status(404).json({ ok: false, error: "File not found" });
    }

    if (isAwsConfigured()) {
      await deleteFromS3(file.key);
    }

    await file.deleteOne();
    return res.json({ ok: true, message: "File deleted" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/** Send email via AWS SES */
router.post("/email", authRequired, async (req, res) => {
  try {
    if (!isSesConfigured()) {
      return res.status(503).json({ ok: false, error: "AWS SES not configured" });
    }

    const { to, subject, message } = req.body;
    if (!to || !subject) {
      return res.status(400).json({ ok: false, error: "to and subject are required" });
    }

    const result = await sendEmail({ to, subject, text: message, html: `<p>${message}</p>` });
    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/** Send welcome email to self */
router.post("/email/welcome", authRequired, async (req, res) => {
  try {
    if (!isSesConfigured()) {
      return res.status(503).json({ ok: false, error: "AWS SES not configured" });
    }

    const user = await findUserById(req.auth.id);
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    const result = await sendWelcomeEmail(user);
    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
