import express from "express";
import { getCashierProduct } from "../controller/cashierController.js";

const router = express.Router();

// GET /api/cashier/:productId
router.get("/:productId", getCashierProduct);

export default router;
