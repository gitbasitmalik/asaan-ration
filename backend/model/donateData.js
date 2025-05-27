import mongoose from "mongoose";

const donateDataSchema = new mongoose.Schema({
    name: String,
    contact: Number,
    location: String,
    foodType: String,
    quantity: String,
    description: String,
    quantityUnit: String,
    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model("DonateData", donateDataSchema);