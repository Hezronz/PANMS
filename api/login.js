const bcrypt = require('bcrypt');
const db = require('../db/db'); // Adjust path if needed

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: "Only POST allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      studentId: user.id,
      message: "Login successful",
      user: { id: user.id, role: user.role },
      success:true
    });

  } catch (err) {
    console.error("Login error:", err);  // <== Check terminal for this
    res.status(500).json({ message: "Internal server error" });
  }
};


