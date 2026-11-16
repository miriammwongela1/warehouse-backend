import express from "express";
import {
  getAllSales,
  getSaleByReceipt,
} from "../controller/managerSalesController.js";

const router = express.Router();

router.get("/", getAllSales);
router.get("/:receiptNumber", getSaleByReceipt);

export default router;