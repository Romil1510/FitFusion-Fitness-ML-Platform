import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import coachRoutes from "./routes/coachRoute.js";
 const app=express();
 dotenv.config({ path: './config/config.env' });


 app.use(cors({
    origin: [process.env.FRONTEND_URL,process.env.BACKEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/coach',coachRoutes)
connectDB();


 export default app;