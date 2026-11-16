import express from "express";
import { updateAlertSettings } from "../controller/alertSettingsController.js";
import { getStaffAlerts, getManagerAlerts, getCashierAlerts } from "../controller/alertController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Manager updates thresholds
router.put("/alert-settings", requireAuth, requireRole("Manager"), updateAlertSettings);

// Staff alerts
router.get("/staff/alerts", requireAuth, getStaffAlerts);

// Manager alerts
router.get("/manager/alerts", requireAuth, getManagerAlerts);

// Cashier alerts
router.get("/cashier/alerts/:productId", requireAuth, getCashierAlerts);

export default router;
