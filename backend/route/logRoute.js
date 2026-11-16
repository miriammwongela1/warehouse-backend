import express from "express";
import { login, logout } from "../controller/logController.js";

const router = express.Router();

// Authentication
router.post("/login", login);     // login with userId + password
router.post("/logout", logout);   // logout

export default router;
