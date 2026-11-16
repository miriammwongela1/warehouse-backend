import DiscountSettings from "../model/discountSettingsModel.js";

export const updateDiscountSettings = async (req, res) => {
  try {
    const { discountRate, expiryDiscountThreshold } = req.body;
    const settings = await DiscountSettings.findOneAndUpdate(
      {},
      { discountRate, expiryDiscountThreshold },
      { upsert: true, new: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error updating discount settings", error: err });
  }
};

export const getDiscountSettings = async (req, res) => {
  try {
    const settings =
      (await DiscountSettings.findOne()) || {
        discountRate: 0,
        expiryDiscountThreshold: 0,
      };
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching discount settings", error: err });
  }
};
