// routes/productRoutes.js
import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controller/productController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, requireRole("Staff", "Manager"), addProduct); // Add product
router.get("/", requireAuth, getProducts); // Get all products
router.get("/:id", requireAuth, getProductById); // Get single product
router.put("/:id", requireAuth, requireRole("Staff", "Manager"), updateProduct); // Update product
router.delete("/:id", requireAuth, requireRole("Staff", "Manager"), deleteProduct); // Delete product

export default router;
