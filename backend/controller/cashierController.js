import Product from "../model/productModel.js";

export const getCashierProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ ProductID: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};