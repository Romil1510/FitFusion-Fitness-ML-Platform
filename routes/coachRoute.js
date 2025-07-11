import express from "express";
import { coachLogin, coachLogout, coachSignup, getMyPlayers } from "../controllers/coachauthController.js";
import { isAuthenticatedCoach } from "../middleware/coachAuth.js";

const router = express.Router();

router.post("/signup", coachSignup);
router.post("/login", coachLogin);
router.post("/logout", isAuthenticatedCoach, coachLogout);

router.get("/players", isAuthenticatedCoach, getMyPlayers);


export default router;
