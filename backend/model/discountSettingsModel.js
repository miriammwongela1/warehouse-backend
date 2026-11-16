import mongoose from "mongoose";

const discountSettingsSchema = new mongoose.Schema({
  discountRate: { 
    type: Number, 
    default: 0 
  }, 
  expiryDiscountThreshold: { 
    type: Number, 
    default: 0 
  } 
});

export default mongoose.model("DiscountSettings", discountSettingsSchema);
