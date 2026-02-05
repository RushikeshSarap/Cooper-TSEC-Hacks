import db from "./config/db.config.js";

const runMigration = async () => {
    try {
        console.log("🔄 Starting migration...");

        // Add start_date
        try {
            await db.query(`ALTER TABLE events ADD COLUMN start_date DATE;`);
            console.log("✅ Added start_date");
        } catch (e: any) {
            if (e.code === '42701') console.log("ℹ️ start_date already exists");
            else console.error("❌ Failed to add start_date:", e.message);
        }

        // Add end_date
        try {
            await db.query(`ALTER TABLE events ADD COLUMN end_date DATE;`);
            console.log("✅ Added end_date");
        } catch (e: any) {
            if (e.code === '42701') console.log("ℹ️ end_date already exists");
            else console.error("❌ Failed to add end_date:", e.message);
        }

        // Add total_budget
        try {
            await db.query(`ALTER TABLE events ADD COLUMN total_budget DECIMAL(10,2) DEFAULT 0.00;`);
            console.log("✅ Added total_budget");
        } catch (e: any) {
            if (e.code === '42701') console.log("ℹ️ total_budget already exists");
            else console.error("❌ Failed to add total_budget:", e.message);
        }

        console.log("🏁 Migration complete.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

runMigration();
