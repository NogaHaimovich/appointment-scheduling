import { db } from "./index";
import { randomUUID } from "crypto";


function formatDate(date: Date): string {
  const iso: string = date.toISOString();
  return iso.split("T")[0]!; 
}


function generateAppointments(
  start: Date,
  end: Date,
  doctors: { id: number }[]
) {
  const appointments: { doctor_id: number; date: string; time: string }[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(new Date(d));
    for (const doctor of doctors) {
      for (let hour = 9; hour <= 17; hour++) {
        appointments.push({
          doctor_id: doctor.id,
          date: dateStr,
          time: hour.toString().padStart(2, "0") + ":00",
        });
      }
    }
  }
  return appointments;
}


function runAsync(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) =>
    db.run(sql, params, (err) => (err ? reject(err) : resolve()))
  );
}
function allAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows as T[])))
  );
}

export async function seed() {
  try {
    console.log("🌱 Seeding database...");


    await runAsync("DELETE FROM appointments");
    await runAsync("DELETE FROM doctor_specialties");
    await runAsync("DELETE FROM doctors");
    await runAsync("DELETE FROM specialties");
    await runAsync("DELETE FROM users");
    console.log("✅ Cleared existing data");

    const specialties = [
      { id: 1, name: "Dermatology", description: "Skin specialist" },
      { id: 2, name: "Orthopedics", description: "Bones and joints" },
      { id: 3, name: "Cardiology", description: "Heart specialist" },
      { id: 4, name: "Pediatrics", description: "Children specialist" },
      { id: 5, name: "Neurology", description: "Brain and nerves" },
    ];
    for (const s of specialties) {
      await runAsync(
        "INSERT INTO specialties (id, name, description) VALUES (?, ?, ?)",
        [s.id, s.name, s.description]
      );
    }
    console.log(`✅ Inserted ${specialties.length} specialties`);

    const doctors = [
      { name: "Dr. Cohen", specialtyId: 1 },
      { name: "Dr. Levi", specialtyId: 2 },
      { name: "Dr. Shapiro", specialtyId: 1 },
      { name: "Dr. Katz", specialtyId: 2 },
      { name: "Dr. Mizrahi", specialtyId: 2 },
      { name: "Dr. Barak", specialtyId: 2 },
      { name: "Dr. Ben-David", specialtyId: 2 },
      { name: "Dr. Goldberg", specialtyId: 3 },
      { name: "Dr. Azoulay", specialtyId: 1 },
      { name: "Dr. Peretz", specialtyId: 4 },
      { name: "Dr. Abramov", specialtyId: 4 },
      { name: "Dr. Kaplan", specialtyId: 5 },
      { name: "Dr. Friedman", specialtyId: 4},
    ];

    for (const doc of doctors) {
      await new Promise<void>((resolve, reject) => {
        db.run("INSERT INTO doctors (name) VALUES (?)", [doc.name], function (this: any, err) {
          if (err) return reject(err);
          db.run(
            "INSERT INTO doctor_specialties (doctor_id, specialty_id) VALUES (?, ?)",
            [this.lastID, doc.specialtyId],
            (err2) => (err2 ? reject(err2) : resolve())
          );
        });
      });
    }
    console.log(`✅ Inserted ${doctors.length} doctors`);

    const users = ["0501111111", "0502222222", "0503333333"];
    for (const phone of users) {
      const userId = randomUUID();
      await runAsync("INSERT INTO users (id, phone) VALUES (?, ?)", [userId, phone]);
    }
    console.log(`✅ Inserted ${users.length} users`);

    const doctorRows = await allAsync<{ id: number }>("SELECT id FROM doctors");
    const startDate = new Date(2025, 11, 15); 
    const endDate = new Date(2025, 11, 31);
    const appointments = generateAppointments(startDate, endDate, doctorRows);

    for (const a of appointments) {
      await runAsync("INSERT INTO appointments (doctor_id, date, time) VALUES (?, ?, ?)", [
        a.doctor_id,
        a.date,
        a.time,
      ]);
    }
    console.log(`✅ Inserted ${appointments.length} appointments`);

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}


if (require.main === module) {
  seed()
    .then(() => db.close(() => console.log("Database connection closed")))
    .catch(() => db.close());
}
