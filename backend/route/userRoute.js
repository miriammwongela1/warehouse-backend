import express from "express";
import { register, login } from "../controller/userController.js";
import { getUsers, updateUser, deleteUser } from "../controller/userManagementController.js";

const route = express.Router();

route.post("/register", register); // create new user
route.post("/login", login);       // user login

// Manager actions
route.get("/", getUsers);        // list all users
route.put("/:id", updateUser);   // edit user
route.delete("/:id", deleteUser);// remove user

export default route;
