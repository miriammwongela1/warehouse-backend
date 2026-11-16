// controllers/alertController.js
import Product from "../model/productModel.js";
import AlertSettings from "../model/alertSettingsModel.js";

// Staff alerts
export const getStaffAlerts = async (req, res) => {
  try {
    const settings = await AlertSettings.findOne() || { lowStockThreshold: 10, expiryDaysThreshold: 7 };
    const products = await Product.find();

    const alerts = products.flatMap((p) => {
      let messages = [];
      if (p.stock < settings.lowStockThreshold) {
        messages.push(`Low stock: ${p.ProductName} has only ${p.stock} units left.`);
      }
      const daysToExpiry = (new Date(p.priceExpiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      if (daysToExpiry <0) {
        messages.push(`Expiry alert: ${p.ProductName} has already expired.`);
      } else if (daysToExpiry <= settings.expiryDaysThreshold) {
        messages.push(`Expiry alert: ${p.ProductName} expires in ${Math.ceil(daysToExpiry)} days.`);
      }
      return messages;
    });

    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching staff alerts", error: err });
  }
};

// Manager alerts
export const getManagerAlerts = async (req, res) => {
  try {
    const settings = await AlertSettings.findOne() || { lowStockThreshold: 10, expiryDaysThreshold: 7 };
    const products = await Product.find();

    const lowStockCount = products.filter(p => p.stock < settings.lowStockThreshold).length;
    const expiringCount = products.filter(p => {
      const daysToExpiry = (new Date(p.priceExpiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return daysToExpiry >= 0 && daysToExpiry <= settings.expiryDaysThreshold;
    }).length;

    const expiredCount = products.filter(p => {
      const daysToExpiry = (new Date(p.priceExpiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return daysToExpiry < 0;
    }).length;

    const alerts = [
      `Low stock items: ${lowStockCount}`,
      `Expiring soon items: ${expiringCount}`,
      `Expired items: ${expiredCount}`
    ];

    const totalProducts = products.reduce(
      (total, product) => {
        return total + Number(product.stock|| 0);
      },
      0
    );

    res.json({
      settings,
      summary: {
         totalProducts,
         lowStockCount, 
         expiringCount, 
         expiredCount 
        },
      alerts
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching manager alerts", error: err });
  }
};

// Cashier Alerts
export const getCashierAlerts = async (req, res) => {
  try {
    const { productId } = req.params;
    const settings = await AlertSettings.findOne() || { lowStockThreshold: 10, expiryDaysThreshold: 7 };
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const alerts = [];

    if (product.stock < settings.lowStockThreshold) {
      alerts.push(`The scanned item (${product.ProductName}) is running low on shelves.`);
    }

    const daysToExpiry = (new Date(product.priceExpiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysToExpiry <= 0) {
      alerts.push(`The scanned item (${product.ProductName}) has expired.`);
    } else if (daysToExpiry <= 2) {
      alerts.push(`The scanned item (${product.ProductName}) is nearing expiry (${Math.ceil(daysToExpiry)} days).`);
    }

    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cashier alerts", error: err });
  }
};

