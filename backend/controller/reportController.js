import Sale from "../model/saleModel.js";
import Product from "../model/productModel.js";
import AlertSettings from "../model/alertSettingsModel.js";

function getDateRange(period) {
  const now = new Date();
  let start;

  if (period === "daily") {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
  } else if (period === "weekly") {
    start = new Date(now);
    start.setDate(now.getDate() - 7);
  } else if (period === "monthly") {
    start = new Date(now);
    start.setMonth(now.getMonth() - 1);
  }

  return { start, end: now };
}

async function buildReport(period) {
  const { start, end } = getDateRange(period);

  const sales = await Sale.find({
    createdAt: { $gte: start, $lte: end },
  });

  const totalSales = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const transactionCount = sales.length;

  // Top selling product
  const productTally = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productTally[item.ProductName]) {
        productTally[item.ProductName] = 0;
      }
      productTally[item.ProductName] += item.quantity;
    });
  });

  let topProduct = null;
  let topQty = 0;
  for (const [name, qty] of Object.entries(productTally)) {
    if (qty > topQty) {
      topQty = qty;
      topProduct = name;
    }
  }

  // Stock health (current snapshot, not period-based)
  const settings = (await AlertSettings.findOne()) || {
    lowStockThreshold: 10,
    expiryDaysThreshold: 7,
  };
  const products = await Product.find();

  const lowStockCount = products.filter(
    (p) => p.stock < settings.lowStockThreshold
  ).length;

  const expiredCount = products.filter((p) => {
    const daysToExpiry =
      (new Date(p.priceExpiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return daysToExpiry < 0;
  }).length;

  return {
    period,
    startDate: start,
    endDate: end,
    totalSales,
    transactionCount,
    topProduct: topProduct || "N/A",
    topProductQty: topQty,
    lowStockCount,
    expiredCount,
  };
}

export const getReports = async (req, res) => {
  try {
    const daily = await buildReport("daily");
    const weekly = await buildReport("weekly");
    const monthly = await buildReport("monthly");

    res.json({ daily, weekly, monthly });
  } catch (err) {
    res.status(500).json({ message: "Error generating reports", error: err.message });
  }
};