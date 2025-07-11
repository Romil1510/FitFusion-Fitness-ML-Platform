import { User } from '../models/User.js';
import { generateToken } from "../utils/jwtToken.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "mysecret";
const JWT_EXPIRE = "7d";



// ================== SIGNUP ==================
export const signup = async (req, res, next) => {
  const { name, email, password,coachCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  let coach = null;
    if (coachCode) {
      coach = await Coach.findOne({ coachCode });
      if (!coach) {
        return res.status(400).json({ message: "Invalid coach code" });
      }
    }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    coach: coach ? coach._id : null,
  });

  

  generateToken(user, "User created successfully", 200, res);
};



// ================== LOGIN ==================
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    // 🧠 Step 1: Check if token exists in cookie
    const existingToken = req.cookies.UserToken;
    if (existingToken) {
      try {
        const decoded = jwt.verify(existingToken, process.env.JWT_SECRET_KEY);
        return res.status(400).json({ message: "Already logged in" });
      } catch (err) {
        // Token invalid or expired – continue to login
      }
    }

    // Step 2: Check login credentials
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Step 3: Create new JWT and set cookie
    generateToken(user, "Login Successfully!", 201, res);

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Server error." });
  }
};


export const logout = (req, res) => {
  res.cookie("UserToken", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production", // Only in HTTPS production
  });

  res.status(200).json({ message: "Logout successful" });
};


export const getMyProfile=async(req,res)=>{
  try {
    const userInfo=req.user;
   return res.status(200).json({
      message:"User show Details",
      userInfo
    })
  } catch (err) {
    return res.status(400).json({
      message:"Not fetch Details"
    })
  }
}


// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      name,
      profile,
      preferences,
      subscription,
    } = req.body;

    // Only update provided fields
    const updates = {};
    if (name) updates.name = name;
    if (profile) updates.profile = profile;
    if (preferences) updates.preferences = preferences;
    if (subscription) updates.subscription = subscription;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};



