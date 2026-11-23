import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { fixturesByDate, liveFixtures } from "../controllers/fixturesController.js";
import { standings, topScorers } from "../controllers/leaguesController.js";
import { matchById } from "../controllers/matchesController.js";
import { teamById } from "../controllers/teamsController.js";
import { health, status } from "../controllers/statusController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/health", health);
router.get("/status", status);
router.get("/fixtures", fixturesByDate);
router.get("/fixtures/live", liveFixtures);
router.get("/leagues/:id/standings", standings);
router.get("/leagues/:id/topscorers", topScorers);
router.get("/matches/:id", matchById);
router.get("/teams/:id", teamById);
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", requireAuth, me);

export default router;
