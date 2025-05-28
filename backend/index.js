import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import requestData from "./model/requestData.js";
import donateData from "./model/donateData.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NGOData from "./model/ngoData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Update to your frontend domain in production
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- ROUTES ---

// Health check
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// --- REQUESTS ---

// Submit a new request
app.post("/", async (req, res) => {
  try {
    const newRequest = new requestData({
      name: req.body.name,
      contact: req.body.contact,
      familySize: req.body.familySize,
      needType: req.body.needType,
      description: req.body.description,
      cnic: req.body.cnic,
      location: req.body.location,
      status: "pending",
      createdAt: new Date(),
    });
    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully", data: newRequest });
  } catch (error) {
    console.error("Error handling POST /:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all requests (for dashboard)
app.get("/request", async (req, res) => {
  try {
    const requests = await requestData.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update request status and completedBy
app.patch("/request/:id", async (req, res) => {
  try {
    const updateFields = { status: req.body.status };
    if (req.body.status === "completed" && req.body.completedBy) {
      updateFields.completedBy = req.body.completedBy;
    }
    const updated = await requestData.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!updated) return res.status(404).send("Request not found");
    res.json(updated);
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).send("Internal Server Error");
  }
});

// --- DONATIONS ---

// Submit a new donation
app.post("/donate", async (req, res) => {
  try {
    const newDonation = new donateData({
      name: req.body.name,
      contact: req.body.contact,
      location: req.body.location,
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      description: req.body.description,
      quantityUnit: req.body.quantityUnit,
      createdAt: new Date(),
    });
    await newDonation.save();
    res.status(201).json({ message: "Donation submitted successfully", data: newDonation });
  } catch (error) {
    console.error("Error handling POST /donate:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all donations
app.get("/donations", async (req, res) => {
  try {
    const donations = await donateData.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update donation quantity
app.patch("/donations/:id", async (req, res) => {
  try {
    const updated = await donateData.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    if (!updated) return res.status(404).send("Donation not found");
    res.json(updated);
  } catch (error) {
    console.error("Error updating donation quantity:", error);
    res.status(500).send("Internal Server Error");
  }
});


const JWT_SECRET = process.env.JWT_SECRET ;

app.post("/ngo/signup", async (req, res) => {
  try {
    const { name, email, phone, city, registrationNumber, password } = req.body;
    if (!name || !email || !phone || !city || !registrationNumber || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existing = await NGOData.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "NGO with this email already exists." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const ngo = new NGOData({
      name, email, phone, city, registrationNumber, password: hashed,
    });
    await ngo.save();
    res.status(201).json({ message: "NGO registered successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error during signup." });
  }
});

app.post("/ngo/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ngo = await NGOData.findOne({ email });
    if (!ngo) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    if (!ngo.isVerified) {
      return res.status(403).json({ error: "Your account is pending admin approval." });
    }
    const isMatch = await bcrypt.compare(password, ngo.password); // <-- await here!
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // JWT logic
    const token = jwt.sign(
      { _id: ngo._id, email: ngo.email, name: ngo.name, city: ngo.city, registrationNumber: ngo.registrationNumber },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      ngo: {
        _id: ngo._id,
        email: ngo.email,
        name: ngo.name,
        city: ngo.city,
        registrationNumber: ngo.registrationNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login." });
  }
});

// List all NGOs pending approval
app.get("/admin/pending-ngos", async (req, res) => {
  // TODO: Add admin authentication middleware here!
  const ngos = await NGOData.find({ isVerified: false });
  res.json(ngos);
});

// Approve an NGO
app.patch("/admin/verify-ngo/:id", async (req, res) => {
  // TODO: Add admin authentication middleware here!
  const ngo = await NGOData.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );
  if (!ngo) return res.status(404).json({ error: "NGO not found" });
  res.json({ message: "NGO verified", ngo });
});


// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

export default app;