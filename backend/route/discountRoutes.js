// routes/discountRoutes.js
import express from "express";
import { updateDiscountSettings, getDiscountSettings } from "../controller/discountSettingsController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("Manager"), getDiscountSettings);
router.put("/", requireAuth, requireRole("Manager"), updateDiscountSettings);

export default router;
