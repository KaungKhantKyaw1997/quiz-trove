const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      createdBy: req.user.username,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { username, password } = req.body;
  const userId = req.params.id;

  try {
    const userData = {
      recordStatus: 3,
      updatedBy: req.user.username,
    };
    if (username) userData.username = username;
    if (password) userData.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const userData = {
      recordStatus: 4,
      updatedBy: req.user.username,
    };

    const deletedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!deletedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, updateUser, deleteUser };
