import mongoose from "mongoose";

const ROLES = ["student", "faculty", "admin"];
const AUTH_PROVIDERS = ["local", "guest", "google"];

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    department: { type: String, default: "Computer Science" },
    year: { type: String, default: "3rd Year" },
    role: { type: String, enum: ROLES, default: "student", index: true },
    rollNumber: { type: String, default: "" },
    imageUrl: { type: String, default: null },
    isGuest: { type: Boolean, default: false },
    authProvider: { type: String, enum: AUTH_PROVIDERS, default: "local" },
    firebaseUid: { type: String, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    fullName: this.fullName,
    email: this.email,
    department: this.department,
    year: this.year,
    role: this.role,
    rollNumber: this.rollNumber,
    imageUrl: this.imageUrl,
    isGuest: this.isGuest,
    authProvider: this.authProvider,
    firebaseUid: this.firebaseUid,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model("User", userSchema);
export { ROLES };
