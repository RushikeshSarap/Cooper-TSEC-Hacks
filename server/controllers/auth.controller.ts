import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.config";

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    // ✅ Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    console.log("Created user");
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // ✅ FIXED: compare with user.password_hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

/* ================= GET ME ================= */
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const [rows]: any = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
