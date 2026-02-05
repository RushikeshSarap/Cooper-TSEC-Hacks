import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.config.js";

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Data normalization
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    console.log(`[Registration] Attempt for: ${normalizedEmail}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Postgres placeholders + RETURNING
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [normalizedName, normalizedEmail, hashedPassword]
    );

    console.log(`✅ [Registration] Success: ID ${result.rows[0].id}, Email: ${result.rows[0].email}`);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
    });

  } catch (err: any) {
    console.error(`❌ [Registration] Error for ${email}:`, err.message);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Data normalization
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log(`[Login] Attempt for: ${normalizedEmail}`);

    // ✅ Postgres query
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      console.warn(`⚠️ [Login] User not found: ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.warn(`⚠️ [Login] Password mismatch for: ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ [Login] Internal Error: JWT_SECRET is missing");
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`✅ [Login] Success: ${normalizedEmail} (ID: ${user.id})`);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err: any) {
    console.error(`❌ [Login] Error for ${email}:`, err.message);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ================= GET ME ================= */
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    res.json({ user: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
