import { Router } from "express";
import { fixturesByDate, liveFixtures } from "../controllers/fixturesController.js";
import { health, status } from "../controllers/statusController.js";

const router = Router();

router.get("/health", health);
router.get("/status", status);
router.get("/fixtures", fixturesByDate);
router.get("/fixtures/live", liveFixtures);

export default router;
