import mongoose from "mongoose";

const requestDataSchema = new mongoose.Schema({
    name: String,
    contact: Number,
    location: String,
    cnic : String,
    familySize: String,
    needType: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    completedBy: { type: String }, // NGO id or email
}, { timestamps: true });


export default mongoose.model("RequestData", requestDataSchema);