console.log("🚨 AUTH DEBUG VERSION LOADED");
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

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  console.log(
    "DATABASE_URL host:",
    process.env.DATABASE_URL.split("@")[1]
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()")
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });

// --- Authentication APIs ---

// Signup API
app.post("/api/signup", async (req, res) => {
  console.log("====== SIGNUP START ======");
  try {
    const { fullname, email, password } = req.body;
    console.log("Request Body:", { fullname, email, password: password ? "********" : "MISSING" });

    if (!fullname || !email || !password) {
      console.log("Validation Failure: Missing fields");
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Check if email already exists
    console.log("Checking existing email:", email);
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log("Validation Failure: Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Generated Hash:", hashedPassword);

    console.log("Inserting user into database...");
    const result = await pool.query(
      `INSERT INTO users (fullname, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, fullname, email, created_at`,
      [fullname, email, hashedPassword]
    );

    console.log("Insert Result:", result.rows);
    console.log("====== SIGNUP SUCCESS ======");

    res.status(201).json({
      message: "User Registered Successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("");
    console.error("========== ERROR ==========");
    console.error("MESSAGE:", error.message);
    console.error("STACK:", error.stack);
    console.error("FULL ERROR:", error);
    console.error("===========================");
    console.error("");

    return res.status(500).json({
      error: error.message
    });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  console.log("====== LOGIN START ======");
  try {
    const { email, password } = req.body;
    console.log("Request Body:", { email, password: password ? "********" : "MISSING" });

    if (!email || !password) {
      console.log("Validation Failure: Email and password are required");
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Searching email:", email);
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("User Not Found for email:", email);
      return res.status(404).json({ error: "User Not Found" });
    }

    const user = result.rows[0];
    console.log("User Found:", { id: user.id, email: user.email, fullname: user.fullname });
    console.log("Stored Password (from DB):", user.password);
    console.log("Incoming Password:", password);

    // IMPORTANT NOTE: If user.password is plain text (e.g., '123456'), 
    // bcrypt.compare will return false because it expects a bcrypt hash.
    
    console.log("Running bcrypt.compare...");
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error("bcrypt.compare error (likely not a hash):", bcryptError.message);
      // If it's not a hash, fallback to direct comparison for debugging/legacy (ONLY IF WE WANT TO SUPPORT IT)
      // isMatch = (password === user.password); 
    }
    
    console.log("Compare Result:", isMatch);

    if (!isMatch) {
      console.log("Authentication Failure: Invalid Password");
      return res.status(401).json({ error: "Invalid Password" });
    }

    // Generate JWT
    console.log("Generating JWT...");
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "solarvista_secret_key",
      { expiresIn: "24h" }
    );
    console.log("JWT Generated Successfully");
    console.log("====== LOGIN SUCCESS ======");

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
    console.error("");
    console.error("========== ERROR ==========");
    console.error("MESSAGE:", error.message);
    console.error("STACK:", error.stack);
    console.error("FULL ERROR:", error);
    console.error("===========================");
    console.error("");

    return res.status(500).json({
      error: error.message
    });
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
