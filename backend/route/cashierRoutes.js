import express from "express";
import { getCashierProduct } from "../controller/cashierController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/cashier/:productId
router.get("/:productId", requireAuth, getCashierProduct);

export default router;
