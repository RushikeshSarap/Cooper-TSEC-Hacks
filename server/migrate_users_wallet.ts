import db from "./config/db.config.js";

const runMigration = async () => {
    try {
        console.log("🔄 Starting migration for users wallet...");

        // Add wallet_balance
        try {
            await db.query(`ALTER TABLE users ADD COLUMN wallet_balance DECIMAL(10,2) DEFAULT 0.00;`);
            console.log("✅ Added wallet_balance to users");
        } catch (e: any) {
            if (e.code === '42701') console.log("ℹ️ wallet_balance already exists");
            else console.error("❌ Failed to add wallet_balance:", e.message);
        }

        console.log("🏁 Migration complete.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

runMigration();
