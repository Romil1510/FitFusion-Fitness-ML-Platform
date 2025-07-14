import express from "express";
import axios from "axios";
import { User } from "../models/User.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.post("/predict", isAuthenticated, async (req, res) => {
  try {
    const mlInput = req.body;
    const userId = req.user.id; // ✅ from JWT, not from request body

    // Step 1: Call Flask ML API
    const response = await axios.post("http://127.0.0.1:5000/predictionModel", mlInput);

    const {
      goal,
      schedule_general_fitness,
      special_sports_exercise,
      ["according to your goal calories you should take"]: calories
    } = response.data;

    // Step 2: Save prediction to User
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        mlPrediction: {
          goal: goal[0],
          schedule: schedule_general_fitness,
          calories: calories[0],
          sportsExercise: special_sports_exercise,
          predictedAt: new Date()
        }
      },
      { new: true }
    );

    res.status(200).json({
      message: "ML prediction saved",
      prediction: updatedUser.mlPrediction,
      prediction: User.mlPrediction
    });

  } catch (err) {
    console.error("ML prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;
