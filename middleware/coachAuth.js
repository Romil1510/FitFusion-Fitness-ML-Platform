// middleware/auth.js
import jwt from "jsonwebtoken";
import { Coach } from "../models/Coach.js";

export const isAuthenticatedCoach = async (req, res, next) => {
  const token = req.cookies.CoachToken;

  if (!token) {
    return res.status(401).json({ message: "Please login as coach first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await Coach.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "Coach not found" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
