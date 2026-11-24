import { Router } from "express";
import { login, logout, me, register, setLanguage } from "../controllers/authController.js";
import { followTeam, listFavorites, unfollowTeam } from "../controllers/favoritesController.js";
import { fixturesByDate, liveFixtures } from "../controllers/fixturesController.js";
import { standings, topScorers } from "../controllers/leaguesController.js";
import { matchById } from "../controllers/matchesController.js";
import { teamById } from "../controllers/teamsController.js";
import { config } from "../config.js";
import { health, status, whoami } from "../controllers/statusController.js";
import { requireAuth } from "../middleware/auth.js";
import { noStore } from "../middleware/noStore.js";
import { loginAccountLimiter, loginEmailLimiter, loginIpLimiter, quotaLimiter, registerLimiter, strictLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.use(["/auth", "/favorites"], noStore); // per-user answers: never cached by Vercel or the browser

router.get("/health", health);
router.get("/status", status);
if (config.DEBUG_IP_ENDPOINT) router.get("/_ip", whoami); // temporary: see TODO.md "after deploying"
router.get("/fixtures", quotaLimiter, fixturesByDate);
router.get("/fixtures/live", liveFixtures);
router.get("/leagues/:id/standings", quotaLimiter, standings);
router.get("/leagues/:id/topscorers", quotaLimiter, topScorers);
router.get("/matches/:id", strictLimiter, matchById);
router.get("/teams/:id", strictLimiter, teamById);
router.post("/auth/register", registerLimiter, register);
router.post("/auth/login", loginIpLimiter, loginAccountLimiter, loginEmailLimiter, login);
router.post("/auth/logout", logout);
router.get("/auth/me", requireAuth, me);
router.put("/auth/language", requireAuth, setLanguage);
router.get("/favorites", requireAuth, listFavorites);
// Following an unknown team looks it up in API-Football, so it is limited like the team page.
router.put("/favorites/:teamId", requireAuth, strictLimiter, followTeam);
router.delete("/favorites/:teamId", requireAuth, unfollowTeam);

export default router;
