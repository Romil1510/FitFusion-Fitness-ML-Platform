import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/dbConnection.js";
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

connectDB();

 export default app;