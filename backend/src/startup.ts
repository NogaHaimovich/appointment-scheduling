import { db } from "./db/index";
import { initializeDatabase } from "./db/init";

// Initialize database on startup only if tables don't exist
export function initializeOnStartup(): void {
  // Check if users table exists (as a proxy for checking if DB is initialized)
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    (err, row) => {
      if (err) {
        console.error("Error checking database:", err);
        return;
      }
      
      if (!row) {
        // Tables don't exist, initialize them
        console.log("Database not initialized, creating tables...");
        initializeDatabase(db);
        console.log("✅ Database initialized");
      }
      // If tables exist, do nothing (silent skip)
    }
  );
}

