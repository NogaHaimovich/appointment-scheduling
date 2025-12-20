import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

// For Vercel serverless, use /tmp directory (writable) or fallback to local data directory
let dbPath: string;
if (process.env.VERCEL || process.env.VERCEL_ENV) {
  // In Vercel, use /tmp directory (only writable location)
  const tmpDbPath = "/tmp/app.db";
  
  // Try to copy database file to /tmp on first run
  // Note: In Vercel, the source file should be in the deployment
  try {
    // Try multiple possible source paths
    const possibleSources = [
      path.join(process.cwd(), "backend/data/app.db"),
      path.join(process.cwd(), "apps/backend/data/app.db"),
      path.join(__dirname, "../../data/app.db"),
      path.join(__dirname, "../../../backend/data/app.db"),
    ];
    
    let sourceFound = false;
    for (const sourcePath of possibleSources) {
      if (fs.existsSync(sourcePath) && !fs.existsSync(tmpDbPath)) {
        fs.copyFileSync(sourcePath, tmpDbPath);
        sourceFound = true;
        console.log(`Database copied from ${sourcePath} to ${tmpDbPath}`);
        break;
      }
    }
    
    if (!sourceFound && !fs.existsSync(tmpDbPath)) {
      console.warn("Database file not found. Creating new database at /tmp/app.db");
      // Database will be created automatically by sqlite3
    }
  } catch (error) {
    console.error("Error copying database:", error);
    // Continue anyway - sqlite3 will create a new database if needed
  }
  
  dbPath = tmpDbPath;
} else {
  // Local development
  dbPath = path.join(__dirname, "../../data/app.db");
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to DB", err);
  } else {
    console.log("Connected to SQLite:", dbPath);
  }
});


