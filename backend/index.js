import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);


//Import dependencies
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

//Import routes
import userRoute from "./route/userRoute.js";
import logRoutes from "./route/logRoute.js";
import productRoute from "./route/productRoute.js";
import alertRoute from "./route/alertRoute.js";
import discountRoutes from "./route/discountRoutes.js";
import cashierRoutes from "./route/cashierRoutes.js";
import checkoutRoutes from "./route/checkoutRoutes.js";
import managerSalesRoutes from "./route/managerSalesRoutes.js";
import reportRoutes from "./route/reportRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

//Routes
app.use("/api/user", userRoute);
app.use("/api/log", logRoutes);
app.use("/api/products", productRoute);
app.use("/api", alertRoute);
app.use("/api/discount-settings", discountRoutes);
app.use("/api/cashier", cashierRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/manager/sales", managerSalesRoutes);
app.use("/api/reports", reportRoutes);

// Read variables from .env
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose 
         .connect(MONGOURL)
         .then(()=>{
            console.log("DB connected succesfully.")
            app.listen(PORT, ()=>{
                console.log(`Server is running on port :${PORT}`)
            })
         })
         .catch((error) => console.log("MongoDB connection error:", error));

