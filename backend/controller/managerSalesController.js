import Sale from "../model/saleModel.js";

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sales", error: err });
  }
};

// Get sale by receipt number
export const getSaleByReceipt = async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const sale = await Sale.findOne({ receiptNumber });
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sale", error: err });
  }
};
