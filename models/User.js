import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

export const User = mongoose.model("User", userSchema);
