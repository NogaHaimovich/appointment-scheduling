import { db } from "./index";
import { initializeDatabase } from "./init";
import { seed } from "./seed";

async function setupDatabase(): Promise<void> {
  try {
    console.log(" Setting up database...");
    
    console.log("Initializing database tables...");
    await new Promise<void>((resolve, reject) => {
      initializeDatabase(db);
      db.wait((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log("Seeding database...");
    await seed();
    
    console.log("Database setup complete!");
  } catch (error) {
    console.error("Database setup failed:", error);
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

