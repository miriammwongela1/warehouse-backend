import express from "express";
import { getAllSales, getSaleByReceipt } from "../controller/managerSalesController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.get("/", requireAuth, requireRole("Manager"), getAllSales); // list all sales
router.get("/:receiptNumber", requireAuth, requireRole("Manager"), getSaleByReceipt); // lookup by receipt
export default router;
