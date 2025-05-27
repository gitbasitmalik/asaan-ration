import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  city: String,
  registrationNumber: String,
  password: String,
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model("NGOData", ngoSchema);