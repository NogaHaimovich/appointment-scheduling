import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(__dirname, "../../data/app.db");
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to DB", err);
  } else {
    console.log("Connected to SQLite:", dbPath);
  }
});


