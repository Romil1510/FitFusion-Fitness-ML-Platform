import jwt from "jsonwebtoken";
import { Coach } from "../models/Coach.js";

// COACH SIGNUP
export const coachSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Coach.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const coach = await Coach.create({ name, email, password });

    const token = coach.generateToken();
    res.cookie("CoachToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    res.status(201).json({
      message: "Coach created",
      coach: {
        id: coach._id,
        name: coach.name,
        email: coach.email,
        coachCode: coach.coachCode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Coach signup error", error: error.message });
  }
};

// COACH LOGIN
export const coachLogin = async (req, res) => {
  try {
    // 🧠 Step 1: Check if token exists in cookie
        const existingToken = req.cookies.CoachToken;
        if (existingToken) {
          try {
            const decoded = jwt.verify(existingToken, process.env.JWT_SECRET_KEY);
            return res.status(400).json({ message: "Already logged in" });
          } catch (err) {
            // Token invalid or expired – continue to login
          }
        }


    const { email, password } = req.body;
    const coach = await Coach.findOne({ email }).select("+password");
    if (!coach) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await coach.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.cookie("CoachToken", coach.generateToken(), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "Coach logged in",
      coach: {
        id: coach._id,
        name: coach.name,
        email: coach.email,
        coachCode: coach.coachCode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

// COACH LOGOUT
export const coachLogout = (req, res) => {
  res.cookie("CoachToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Coach logged out" });
};

// GET MY PLAYERS
export const getMyPlayers = async (req, res) => {
  try {
    const coach = await Coach.findById(req.user._id).populate("players", "-password");
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    res.status(200).json({ players: coach.players });
  } catch (error) {
    res.status(500).json({ message: "Error fetching players", error: error.message });
  }
};
