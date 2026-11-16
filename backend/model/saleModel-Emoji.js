import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },

  cashierId: {
    type: String,
    ref: "User",
    required: true,
  },

  items: [
    {
      ProductID: { type: String, required: true },
      ProductName: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      lineTotal: { type: Number, required: true },
    },
  ],

  subtotal: { type: Number, required: true },
  discountTotal: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },

  paymentMethod: { type: String, default: "cash" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Sale", saleSchema);