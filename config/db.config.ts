import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL Connected Successfully");
        connection.release(); // Release connection back to pool
    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ MySQL Connection Error:", error.message);
        } else {
            console.error("❌ MySQL Connection Error:", error);
        }
        process.exit(1); // Exit process on failure
    }
};

export default pool;
