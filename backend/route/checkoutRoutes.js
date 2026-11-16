// checkoutRoutes.js
import express from "express";
import { checkout } from "../controller/checkoutController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.post("/", requireAuth, requireRole("Cashier", "Manager"), checkout);
export default router;
