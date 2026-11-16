// routes/discountRoutes.js
import express from "express";
import { updateDiscountSettings, getDiscountSettings } from "../controller/discountSettingsController.js";

const router = express.Router();

router.get("/", getDiscountSettings);
router.put("/", updateDiscountSettings);

export default router;
