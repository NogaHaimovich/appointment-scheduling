import { db } from "./db/index";
import { initializeDatabase } from "./db/init";

export function initializeOnStartup(): void {
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    (err, row) => {
      if (err) {
        console.error("Error checking database:", err);
        return;
      }
      
      if (!row) {
        console.log("Database not initialized, creating tables...");
        initializeDatabase(db);
        console.log("Database initialized");
      }
    }
  );
}

