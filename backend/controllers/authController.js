const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/generateOTP");
const { generateUsername } = require("../utils/generateUsername");
const { sendEmail } = require("../utils/sendEmail");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  console.log("Backend received:", req.body);

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await pool.query(
      "INSERT INTO users(email,password,otp) VALUES($1,$2,$3)",
      [email, hashed, otp]
    );

    await sendEmail(email, "OTP Code", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.log("REGISTER ERROR:", error); // 🔥 see real error in terminal
    res.status(500).json({ error: "Server error" });
  }
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length)
    return res.status(404).json({ error: "User not found" });

  if (user.rows[0].otp !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  const username = generateUsername(email);

  await pool.query(
    "UPDATE users SET is_verified=true, username=$1, otp=null WHERE email=$2",
    [username, email]
  );

  await sendEmail(
    email,
    "Registration Completed",
    `Username: ${username}\nPassword: (your chosen password)`
  );

  res.json({ message: "Registration successful" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length)
    return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid)
    return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    username: user.rows[0].username,
  });
};
