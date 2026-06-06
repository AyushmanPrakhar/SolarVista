import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";

const { Pool } = pg;

// ESM equivalent for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully (ESM)");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });

// --- Authentication APIs ---

// Signup API
app.post("/api/signup", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (fullname, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, fullname, email, created_at`,
      [fullname, email, hashedPassword]
    );

    res.status(201).json({
      message: "User Registered Successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Signup Failed" });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const user = result.rows[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "solarvista_secret_key",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        created_at: user.created_at
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login Failed" });
  }
});

// --- Utility APIs ---

// GHI API (Legacy/Dashboard Support)
app.get("/api/ghi", (req, res) => {
  res.json([
    { state: "Rajasthan", ghi: 6.5, solarPotential: "Very High" },
    { state: "Gujarat", ghi: 5.9, solarPotential: "High" },
    { state: "Tamil Nadu", ghi: 5.5, solarPotential: "High" },
  ]);
});

app.get("/", (req, res) => {
  res.send("SolarVista API is Running (ESM Mode)");
});

// Global Error Handler for Async Errors
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ESM mode`);
});
