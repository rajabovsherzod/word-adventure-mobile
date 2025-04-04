import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB ulanish
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/word-adventure');
    console.log(`MongoDB ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB ulanishda xatolik:', error);
    process.exit(1);
  }
};

// Server ishga tushirish
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishga tushdi`);
  });
}); 