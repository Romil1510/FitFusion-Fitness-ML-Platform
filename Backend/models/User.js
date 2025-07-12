import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    coachCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      default: null,
    },
    
    profile: {
      age: { type: Number, min: 13, max: 100 },
      height: { type: Number, min: 100, max: 250 },
      weight: { type: Number, min: 30, max: 300 },
      gender: { type: String, enum: ["male", "female", "other"] },
      sport: String,
      position: String,
      experience: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "professional"],
      },
      trainingFrequency: {
        type: String,
        enum: ["2-3", "4-5", "6-7", "multiple"],
      },
      primaryGoal: {
        type: String,
        enum: ["performance", "fitness", "recovery", "competition"],
      },
      specificGoals: [String],
      hasInjuries: { type: Boolean, default: false },
      injuryDetails: String,
      currentLimitations: String,
    },
    transformationGoal: {
      type: String,
      enum: ["muscle_gain", "weight_loss", "weight_gain"],
      default: "muscle_gain",
    },
    preferences: {
      dietType: {
        type: String,
        enum: ["regular", "vegetarian", "vegan", "keto", "paleo"],
      },
      allergies: [String],
      workoutDuration: { type: Number, default: 60 },
      preferredWorkoutTime: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "premium", "pro"],
        default: "free",
      },
      startDate: Date,
      endDate: Date,
    },
    lastActive: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
