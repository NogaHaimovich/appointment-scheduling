import type { Database } from "sqlite3";
import { db } from "./index";

export function initializeDatabase(db: Database): void {
  db.serialize(() => {
    console.log("Creating tables...");

    db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        phone TEXT NOT NULL UNIQUE,
        name TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        relationship TEXT NOT NULL, -- self | child | parent | spouse | other
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS specialties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS doctor_specialties (
        doctor_id INTEGER NOT NULL,
        specialty_id INTEGER NOT NULL,
        PRIMARY KEY (doctor_id, specialty_id),
        FOREIGN KEY (doctor_id) REFERENCES doctors(id),
        FOREIGN KEY (specialty_id) REFERENCES specialties(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        account_id TEXT,
        patient_id INTEGER,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id),
        FOREIGN KEY (account_id) REFERENCES accounts(id),
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        UNIQUE (doctor_id, date, time)
      )
    `);

    console.log("Tables created");
  });
}

if (require.main === module) {
  initializeDatabase(db);
  db.close(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
}
