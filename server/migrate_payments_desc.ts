import db from "./config/db.config";

const runMigration = async () => {
    try {
        console.log("🔄 Starting migration for payments description...");

        try {
            await db.query(`ALTER TABLE payments ADD COLUMN description VARCHAR(255);`);
            console.log("✅ Added description to payments");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ description already exists");
            else console.error("❌ Failed to add description:", e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

runMigration();
