import mongoose from "mongoose";

const CATEGORIES = ["resume", "profile", "document", "event", "assignment"];

const uploadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    key: { type: String, required: true },
    url: { type: String, required: true },
    bucket: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, default: "document", index: true },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
);

uploadSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    key: this.key,
    url: this.url,
    bucket: this.bucket,
    fileName: this.fileName,
    mimeType: this.mimeType,
    category: this.category,
    size: this.size,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("Upload", uploadSchema);
export { CATEGORIES };
