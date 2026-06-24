import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    displayName: { type: String },
    age: { type: Number },
    gender: { type: String },
    country: { type: String },
    city: { type: String },
    whatsapp: { type: String },
    occupation: { type: String },
    education: { type: String },
    religion: { type: String },
    height: { type: String },
    maritalStatus: { type: String },
    children: { type: String },
    aboutMe: { type: String },
    goal: { type: String },
    preference: { type: String },
    images: [{ type: String }], // Cloudinary URLs
    paymentStatus: { type: String, default: "Unpaid" }, // Unpaid or Paid
    referenceId: { type: String }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;