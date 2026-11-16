// routes/productRoutes.js
import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controller/productController.js";

const router = express.Router();

router.post("/", addProduct);        // Add product
router.get("/", getProducts);        // Get all products
router.get("/:id", getProductById);  // Get single product
router.put("/:id", updateProduct);   // Update product
router.delete("/:id", deleteProduct);// Delete product

export default router;
