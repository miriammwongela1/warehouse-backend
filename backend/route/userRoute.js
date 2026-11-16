import express from "express";
import { register, login } from "../controller/userController.js";
import { getUsers, updateUser, deleteUser } from "../controller/userManagementController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const route = express.Router();

route.post("/register", register); // create new user
route.post("/login", login);       // user login

// Manager actions
route.get("/", requireAuth, requireRole("Manager"), getUsers);        // list all users
route.put("/:id", requireAuth, requireRole("Manager"), updateUser);   // edit user
route.delete("/:id", requireAuth, requireRole("Manager"), deleteUser);// remove user

export default route;
