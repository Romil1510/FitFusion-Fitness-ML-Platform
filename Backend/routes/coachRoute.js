import express from "express";
import { coachForgotPassword, coachLogin, coachLogout, coachResetPassword, coachSignup, getMyPlayers,getPlayerProfile } from "../controllers/coachauthController.js";
import { isAuthenticatedCoach } from "../middleware/coachAuth.js";

const router = express.Router();

router.post("/signup", coachSignup);
router.post("/login", coachLogin);
router.post("/logout", isAuthenticatedCoach, coachLogout);

router.get("/players", isAuthenticatedCoach, getMyPlayers);

// Password Reset Routes
router.post('/forgot-password', coachForgotPassword);
router.post('/reset-password/:token', coachResetPassword);
// Add this import at the top


// Add this route
router.get("/player/:playerId/profile", isAuthenticatedCoach, getPlayerProfile);


export default router;
