import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  ProductID: { 
    type: String, 
    required: true, 
    unique: true 
  },
  ProductName: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  priceExpiryDate: { 
    type: Date, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
