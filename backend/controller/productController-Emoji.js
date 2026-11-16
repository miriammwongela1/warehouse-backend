// controllers/productController.js

import Product from "../model/productModel.js";


//Helper function: generate ProductID
function generateProductID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "PRD-";

  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
}


// Add new product (auto-generate ProductID)
export const addProduct = async (req, res) => {
  try {
    let newId;
    let exists = true;

    // Ensure ProductID is unique
    while (exists) {
      newId = generateProductID();
      exists = await Product.findOne({ ProductID: newId });
    }

    const product = new Product({
      ...req.body,
      ProductID: newId, // backend controls ID
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//  Get single product by Mongo _id (internal use only)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update product (ProductID is LOCKED)
export const updateProduct = async (req, res) => {
  try {
    const { ProductID, ...rest } = req.body; // remove ProductID if sent

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      rest,
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


//Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};