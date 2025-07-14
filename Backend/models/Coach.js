import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import crypto from "crypto";

const coachSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coach name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Coach email is required"],
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
      type: String,
      unique: true,
      default: () => nanoid(8),
    },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  },
  { timestamps: true }
);

coachSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

coachSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

coachSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: "coach" }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

coachSchema.methods.getResetPasswordToken = function () {
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

export const Coach = mongoose.model("Coach", coachSchema);
