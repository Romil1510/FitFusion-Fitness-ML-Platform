import jwt from "jsonwebtoken";
import { Coach } from "../models/Coach.js";
import crypto from "crypto";
import { User } from "../models/User.js";

// GET INDIVIDUAL PLAYER PROFILE
export const getPlayerProfile = async (req, res) => {
  try {
    const { playerId } = req.params;
    const coachId = req.user._id;

    // Verify this player belongs to this coach
    const coach = await Coach.findById(coachId);
    if (!coach.players.includes(playerId)) {
      return res.status(403).json({ message: "Access denied to this player" });
    }

    // Get fresh player data
    const player = await User.findById(playerId)
      .select("-password -resetPasswordToken -resetPasswordExpire");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({
      success: true,
      ...player.toObject(),
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching player profile",
      error: error.message,
    });
  }
};


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
    const coachId = req.user._id;

    const coach = await Coach.findById(coachId)
      .populate({
        path: "players",
        select: "-password -resetPasswordToken -resetPasswordExpire", // optional clean
      });

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.status(200).json({
      message: "Players fetched successfully",
      players: coach.players,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching players",
      error: error.message,
    });
  }
};


// FORGOT PASSWORD
export const coachForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const coach = await Coach.findOne({ email });
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    // Get reset token
    const resetToken = coach.getResetPasswordToken();
    await coach.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/coach/reset-password/${resetToken}`;

    // Here you would typically send an email with the reset URL
    // For now, we'll just log it to the console
    console.log("Password reset link:", resetUrl);

    res.status(200).json({
      message: "Password reset link sent to email",
      // In development, return the token for testing
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    // If there's an error, reset the tokens
    coach.resetPasswordToken = undefined;
    coach.resetPasswordExpire = undefined;
    await coach.save({ validateBeforeSave: false });

    res.status(500).json({
      message: "Failed to send password reset email",
      error: error.message,
    });
  }
};



// Update user profile with ML predictions
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    // Update user with new ML prediction data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...updateData,
        updatedAt: new Date(),
        lastDataUpdate: new Date() // Track when ML data was updated
      },
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      message: "Failed to update profile", 
      error: error.message 
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Failed to get profile", 
      error: error.message 
    });
  }
};

// RESET PASSWORD
export const coachResetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const coach = await Coach.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!coach) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Set new password
    coach.password = req.body.password;
    coach.resetPasswordToken = undefined;
    coach.resetPasswordExpire = undefined;

    await coach.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
