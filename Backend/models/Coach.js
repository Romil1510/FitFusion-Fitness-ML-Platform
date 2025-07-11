import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

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

export const Coach = mongoose.model("Coach", coachSchema);
