import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.config";

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= GET ME ================= */
export const getMe = async (req: Request, res: Response) => {
  try {
    // userId injected by auth middleware
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
