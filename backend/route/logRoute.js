import express from "express";
import { login, logout } from "../controller/logController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Authentication
router.post("/login", login);     // login with userId + password
router.post("/logout", requireAuth, logout);   // logout

export default router;
