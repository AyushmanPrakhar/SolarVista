console.log("🚨 PRO-DEBUG VERSION: V2 - SCHEMA AWARE");
import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";

const { Pool } = pg;
const app = express();

app.use(cors());
app.use(express.json());

// --- Database Connection ---

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : null;

if (!connectionString) {
  console.error("❌ CRITICAL: DATABASE_URL is missing!");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Startup Diagnostics
const runStartupDiagnostics = async () => {
  console.log("==========================================");
  console.log("🔍 STARTUP DATABASE DIAGNOSTICS");
  try {
    const res = await pool.query(`
      SELECT 
        current_database() as db, 
        current_user as user, 
        current_schema() as schema,
        current_setting('search_path') as search_path,
        NOW() as time
    `);
    
    const { db, user, schema, search_path } = res.rows[0];
    console.log(`📂 Database    : ${db}`);
    console.log(`👤 User        : ${user}`);
    console.log(`🧭 Schema      : ${schema}`);
    console.log(`🛣️  Search Path : ${search_path}`);

    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log("✅ SUCCESS: 'users' table is visible in public schema.");
    } else {
      console.error("❌ ERROR: 'users' table is MISSING in public schema!");
      
      // List all tables that ARE visible
      const allTables = await pool.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log("📋 Visible Tables in 'public':", allTables.rows.map(t => t.table_name).join(", ") || "NONE");
    }
  } catch (err) {
    console.error("❌ DIAGNOSTICS FAILED:", err.message);
  }
  console.log("==========================================");
};

runStartupDiagnostics();

// --- Diagnostic Route ---
app.get("/api/db-diagnostics", async (req, res) => {
  try {
   const tables = await pool.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
`);

const allTables = await pool.query(`
  SELECT
      table_schema,
      table_name
  FROM information_schema.tables
  ORDER BY table_schema, table_name;
`);

res.json({
  timestamp: new Date().toISOString(),
  connection: dbInfo.rows[0],
  visible_tables_public: tables.rows.map(t => t.table_name),
  all_tables: allTables.rows,
  env_db_url_provided: !!process.env.DATABASE_URL
});
    
    res.json({
      timestamp: new Date().toISOString(),
      connection: dbInfo.rows[0],
      visible_tables_public: tables.rows.map(t => t.table_name),
      env_db_url_provided: !!process.env.DATABASE_URL
    });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// --- Authentication APIs ---

// Signup API
app.post("/api/signup", async (req, res) => {
  console.log("====== SIGNUP START ======");
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Check if email already exists using EXPLICIT SCHEMA
    const existingUser = await pool.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // INSERT using EXPLICIT SCHEMA
    const result = await pool.query(
      `INSERT INTO public.users (fullname, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, fullname, email, created_at`,
      [fullname, email, hashedPassword]
    );

    console.log("====== SIGNUP SUCCESS ======");
    res.status(201).json({
      message: "User Registered Successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("========== ERROR ==========");
    console.error("MESSAGE:", error.message);
    console.error("FULL ERROR:", error);
    console.error("===========================");

    return res.status(500).json({
      error: error.message,
      hint: "Check /api/db-diagnostics to verify table existence"
    });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  console.log("====== LOGIN START ======");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // SELECT using EXPLICIT SCHEMA
    const result = await pool.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

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
    return res.status(500).json({ error: error.message });
  }
});

// --- Utility APIs ---
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
