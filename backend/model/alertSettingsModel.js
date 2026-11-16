import mongoose from "mongoose";

const alertSettingsSchema = new mongoose.Schema({
  lowStockThreshold: { type: Number, default: 10 },
  expiryDaysThreshold: { type: Number, default: 7 }
});

export default mongoose.model("AlertSettings", alertSettingsSchema);
