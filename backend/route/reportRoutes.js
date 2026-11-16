import express from "express";
import { getReports } from "../controller/reportController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("Manager"), getReports);

export default router;