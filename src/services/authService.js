const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const { Op } = require("sequelize");

module.exports = {
  async register(username, email, password) {
    this.validateEmail(email);
    const existing = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (existing) throw new Error("Username or email already taken");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashed });
    return user;
  },

  async login(email, password) {
    this.validateEmail(email);
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { token, user };
  },

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== "string") {
      throw new Error("email is required");
    }

    if (!regex.test(email)) {
      throw new Error("invalid email format");
    }

    return true;
  },
};
