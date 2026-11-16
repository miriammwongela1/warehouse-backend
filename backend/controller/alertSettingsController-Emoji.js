// controllers/alertSettingsController.js
import AlertSettings from "../model/alertSettingsModel.js";

export const getAlertSettings = async (req, res) => {
  try {
    const settings = await AlertSettings.findOne() || { lowStockThreshold: 10, expiryDaysThreshold: 7 };
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching alert settings", error: err });
  }
};

export const updateAlertSettings = async (req, res) => {
  try {
    const { lowStockThreshold, expiryDaysThreshold } = req.body;

    const settings = await AlertSettings.findOneAndUpdate(
      {},
      { lowStockThreshold, expiryDaysThreshold },
      { upsert: true, new: true }
    );

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error updating alert settings", error: err });
  }
};
