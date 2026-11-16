import express from "express";
import { updateAlertSettings } from "../controller/alertSettingsController.js";
import { getStaffAlerts, getManagerAlerts, getCashierAlerts } from "../controller/alertController.js";

const router = express.Router();

// Manager updates thresholds
router.put("/alert-settings", updateAlertSettings);

// Staff alerts
router.get("/staff/alerts", getStaffAlerts);

// Manager alerts
router.get("/manager/alerts", getManagerAlerts);

// Cashier alerts
router.get("/cashier/alerts/:productId", getCashierAlerts);

export default router;
