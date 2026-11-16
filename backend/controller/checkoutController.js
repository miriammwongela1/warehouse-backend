import Sale from "../model/saleModel.js";
import Product from "../model/productModel.js";
import { v4 as uuidv4 } from "uuid";

export const checkout = async (req, res) => {
  try {
    const { cart, paymentMethod, cashierId } = req.body;

    let subtotal = 0;
    let discountTotal = 0;
    const items = [];

    for (const item of cart) {
      const product = await Product.findOne({ ProductID: item.ProductID });
      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.ProductName}. Available: ${product.stock}`,
        });
      }

      const lineTotal = item.unitPrice * item.quantity;
      subtotal += lineTotal;

      if (item.discountedPrice && item.discountedPrice < product.price) {
        discountTotal += (product.price - item.discountedPrice) * item.quantity;
      }

      product.stock -= item.quantity;
      await product.save();

      items.push({
        ProductID: product.ProductID,
        ProductName: product.ProductName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
      });
    }

    const grandTotal = subtotal - discountTotal;

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

    res.json({ message: "Sale completed", sale });
  } catch (err) {
    res.status(500).json({ message: "Error processing checkout", error: err.message });
  }
};