import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// CORS konfiguratsiyasi
const corsOptions = {
  origin: "*", // Barcha originlarga ruxsat berish
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// MongoDB ulanish
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/word-adventure"
    );
    console.log(`MongoDB ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB ulanishda xatolik:", error);
    process.exit(1);
  }
};

// Server ishga tushirish
const PORT = process.env.PORT || 3000; // Port 3000 ga o'zgartirildi
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    // Barcha interfeyslarda tinglash
    console.log(`Server ${PORT} portda ishga tushdi`);
  });
});
