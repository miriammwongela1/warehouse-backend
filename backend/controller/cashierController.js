import Product from "../model/productModel.js";
import DiscountSettings from "../model/discountSettingsModel.js";
import { getDiscountedPrice } from "../utils/discountPricing.js";

export const getCashierProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ ProductID: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const settings = (await DiscountSettings.findOne()) || {
      discountRate: 0,
      expiryDiscountThreshold: 0,
    };

    res.json({
      product: {
        ...product.toJSON(),
        discountedPrice: getDiscountedPrice(product, settings),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};