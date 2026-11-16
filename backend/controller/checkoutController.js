import Sale from "../model/saleModel.js";
import Product from "../model/productModel.js";
import DiscountSettings from "../model/discountSettingsModel.js";
import { getDiscountedPrice } from "../utils/discountPricing.js";
import { v4 as uuidv4 } from "uuid";

export const checkout = async (req, res) => {
  const deducted = [];

  const restoreStock = async () => {
    while (deducted.length > 0) {
      const { ProductID, quantity } = deducted[deducted.length - 1];
      const result = await Product.updateOne(
        { ProductID },
        { $inc: { stock: quantity } }
      );

      if (result.matchedCount !== 1) {
        throw new Error(`Could not restore stock for ${ProductID}`);
      }

      deducted.pop();
    }
  };

  try {
    const { cart, paymentMethod, cashierId } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart must contain at least one item." });
    }

    const settings = (await DiscountSettings.findOne()) || {
      discountRate: 0,
      expiryDiscountThreshold: 0,
    };
    const now = new Date();
    let subtotal = 0;
    const items = [];

    for (const item of cart) {
      const ProductID = item?.ProductID;
      if (!ProductID) {
        return res.status(400).json({
          message: "Unknown product: missing ProductID.",
        });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          message: `Quantity for ${ProductID} must be an integer of at least 1.`,
        });
      }

      const product = await Product.findOne({ ProductID });
      if (!product) {
        return res.status(400).json({ message: `Unknown product: ${ProductID}.` });
      }

      const discountedPrice = getDiscountedPrice(product, settings, now);
      const unitPrice =
        discountedPrice != null && discountedPrice < product.price
          ? discountedPrice
          : product.price;
      const lineTotal = unitPrice * item.quantity;

      subtotal += product.price * item.quantity;

      items.push({
        ProductID: product.ProductID,
        ProductName: product.ProductName,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      });
    }

    for (const item of items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { ProductID: item.ProductID, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        const productExists = await Product.exists({ ProductID: item.ProductID });
        await restoreStock();
        return res.status(400).json({
          message: productExists
            ? `insufficient stock for ${item.ProductName}`
            : `Unknown product: ${item.ProductID}.`,
        });
      }

      deducted.push({ ProductID: item.ProductID, quantity: item.quantity });
    }

    const grandTotal = items.reduce((total, item) => total + item.lineTotal, 0);
    const discountTotal = subtotal - grandTotal;

    const sale = new Sale({
      receiptNumber: uuidv4(),
      cashierId,
      items,
      subtotal,
      discountTotal,
      grandTotal,
      paymentMethod,
    });

    await sale.save();
    deducted.length = 0;

    res.json({ message: "Sale completed", sale });
  } catch (err) {
    try {
      await restoreStock();
    } catch (restoreError) {
      return res.status(500).json({
        message: "Error processing checkout and restoring stock",
        error: err.message,
        restoreError: restoreError.message,
      });
    }

    res.status(500).json({ message: "Error processing checkout", error: err.message });
  }
};