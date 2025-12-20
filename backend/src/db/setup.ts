import { db } from "./index";
import { initializeDatabase } from "./init";
import { seed } from "./seed";

// Combined script to initialize and seed the database
async function setupDatabase(): Promise<void> {
  try {
    console.log("🔧 Setting up database...");
    
    // Initialize tables (wrap in promise to ensure completion)
    console.log("📋 Initializing database tables...");
    await new Promise<void>((resolve, reject) => {
      initializeDatabase(db);
      // Wait for all operations in serialize queue to complete
      db.wait((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Seed data
    console.log("🌱 Seeding database...");
    await seed();
    
    console.log("✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err);
      } else {
        console.log("Database connection closed");
      }
      process.exit(err ? 1 : 0);
    });
  }
}

if (require.main === module) {
  setupDatabase();
}

