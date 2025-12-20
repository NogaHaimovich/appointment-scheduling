import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../../data/app.db");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to DB", err);
  } else {
    console.log("Connected to SQLite:", dbPath);
  }
});


