import { Router } from "express";
import { health, status } from "../controllers/statusController.js";

const router = Router();

router.get("/health", health);
router.get("/status", status);

export default router;
