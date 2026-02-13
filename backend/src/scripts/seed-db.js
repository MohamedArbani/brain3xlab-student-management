const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runSeed() {
  const client = await pool.connect();
  
  try {
    console.log("🔌 Connected to database");
    console.log("📋 Starting database seeding...\n");

    // Read and execute tables.sql
    const tablesPath = path.join(__dirname, "../../../seed_db/tables.sql");
    const tablesSQL = fs.readFileSync(tablesPath, "utf8");
    
    console.log("📊 Creating tables...");
    await client.query(tablesSQL);
    console.log("✅ Tables created successfully\n");

    // Read and execute seed-db.sql
    const seedPath = path.join(__dirname, "../../../seed_db/seed-db.sql");
    const seedSQL = fs.readFileSync(seedPath, "utf8");
    
    console.log("🌱 Seeding data...");
    await client.query(seedSQL);
    console.log("✅ Data seeded successfully\n");

    console.log("🎉 Database setup completed!");
    
  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
