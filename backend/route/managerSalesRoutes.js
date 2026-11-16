import express from "express";
import { getAllSales, getSaleByReceipt } from "../controller/managerSalesController.js";

const router = express.Router();
router.get("/", getAllSales); // list all sales
router.get("/:receiptNumber", getSaleByReceipt); // lookup by receipt
export default router;
