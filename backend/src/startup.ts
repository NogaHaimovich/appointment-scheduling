import { db } from "./db/index";
import { initializeDatabase } from "./db/init";

export function initializeOnStartup(): void {
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'",
    (err, row) => {
      if (err) {
        console.error("Error checking database:", err);
        return;
      }
      
      if (!row) {
        console.log("Database not initialized, creating tables...");
        initializeDatabase(db);
        console.log("Database initialized");
      } else {
        // Check if name column exists, if not add it
        db.all("PRAGMA table_info(accounts)", (err, cols: any[]) => {
          if (err) {
            console.error("Error checking columns:", err);
            return;
          }
          
          const hasNameColumn = cols.some((col: any) => col.name === "name");
          if (!hasNameColumn) {
            console.log("Adding name column to accounts table...");
            db.run("ALTER TABLE accounts ADD COLUMN name TEXT", (err) => {
              if (err) {
                console.error("Error adding name column:", err);
              } else {
                console.log("Name column added successfully");
              }
            });
          }
        });
      }
    }
  );

}
