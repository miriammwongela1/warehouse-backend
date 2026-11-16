import User from "../model/userModel.js";
import bcrypt from "bcryptjs";

/**
 * @desc    Login user with username + password
 * @route   POST /api/log/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // 1. Find user by employee ID
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(400).json({ message: "Invalid employee ID or password." });
    }

    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid employee ID or password." });
    }

    // 3. Return role so frontend can redirect
    res.json({
      message: "Login successful",
      role: user.role,
      fullname: user.fullname,
      username: user.username,
      employeeId: user.employeeId
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/log/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  try {
    // In a simple setup, logout just clears client session/localStorage.
    res.json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
