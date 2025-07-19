import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import coachRoutes from "./routes/coachRoute.js";
import mlRoutes from "./routes/mlRoute.js";
 const app=express();
 dotenv.config({ path: './config/config.env' });


  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow cookies & headers
  }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/coach',coachRoutes);
app.use('/api/ml',mlRoutes);
connectDB();


 export default app;
