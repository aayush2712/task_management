const authService = require("../services/authService");

module.exports = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.status(500).json({ message: "Missing fields" });

      const user = await authService.register(username, email, password);
      return res
        .status(201)
        .json({ id: user.id, username: user.username, email: user.email });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(500).json({ message: "Missing fields" });

      const { token, user } = await authService.login(email, password);
      return res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
