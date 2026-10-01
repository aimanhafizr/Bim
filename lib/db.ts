import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { initialBookings } from "@/app/hallsData";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "booking-hall.db");

function createDatabase(): DatabaseSync {
  fs.mkdirSync(DB_DIR, { recursive: true });

  const db = new DatabaseSync(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_ref TEXT NOT NULL UNIQUE,
      hall_id TEXT NOT NULL,
      hall_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time_slots TEXT NOT NULL,
      total_paid REAL NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'success',
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const { count } = db.prepare("SELECT COUNT(*) AS count FROM bookings").get() as { count: number };
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO bookings (booking_ref, hall_id, hall_name, date, time_slots, total_paid, payment_status, name, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const booking of initialBookings) {
      insert.run(
        booking.id,
        booking.hallId,
        booking.hallName,
        booking.date,
        JSON.stringify(booking.timeSlots),
        booking.totalPaid,
        booking.paymentStatus,
        booking.name,
        booking.email,
        booking.createdAt
      );
    }
  }

  return db;
}

const globalForDb = globalThis as unknown as { sqliteDb?: DatabaseSync };

export const db = globalForDb.sqliteDb ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqliteDb = db;
}
