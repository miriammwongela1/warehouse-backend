import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ── Generate Employee ID based on role ──
async function generateEmployeeId(role) {
  const prefix = role === "Manager" ? "MGR" 
               : role === "Staff" ? "STF" 
               : "CSH";
  
  let employeeId;
  let exists = true;

  // Keep generating until unique
  while (exists) {
    const number = Math.floor(100 + Math.random() * 900);
    employeeId = `${prefix}-${number}`;
    exists = await User.findOne({ employeeId });
  }

  return employeeId;
}

export const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, username, password, role } = req.body;

    if (!fullname || !email || !phonenumber || !username || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!["Staff", "Cashier"].includes(role)) {
      return res.status(400).json({
        message: "Only Staff and Cashier roles can register publicly.",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Generate employee ID
    const employeeId = await generateEmployeeId(role);

    //Encrypt password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      employeeId,
      fullname,
      email,
      phonenumber,
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ 
      message: "User registered successfully.",
      token,
      user: {
        _id: newUser._id,
        employeeId: newUser.employeeId,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        employeeId: user.employeeId,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
