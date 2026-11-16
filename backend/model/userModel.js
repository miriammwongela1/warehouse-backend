import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true
  },
  fullname: { 
              type: String, 
              required: true 
             },
  email: {  
           type: String, 
           required: true, 
           unique: true 
        },
  phonenumber: { 
                 type: String, 
                 required: true
                },
  username: { 
              type: String, 
              required: true 
            },
  password: { 
              type: String, 
              required: true 
            },
  role: { 
           type: String, 
           enum: ["Manager", "Staff", "Cashier"], 
           required: true 
        }   
});

export default mongoose.model("User", userSchema);
