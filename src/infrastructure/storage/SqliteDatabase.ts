// src/infrastructure/storage/SqliteDatabase.ts
import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync("stopscout.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stops (
      stopId INTEGER PRIMARY KEY NOT NULL,
      stopName TEXT NOT NULL,
      stopDesc TEXT,
      stopLat REAL NOT NULL,
      stopLon REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      userId TEXT NOT NULL,
      stopId INTEGER NOT NULL,
      stopName TEXT NOT NULL,
      stopLat REAL NOT NULL,
      stopLon REAL NOT NULL,
      notes TEXT,
      PRIMARY KEY (userId, stopId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_stops_coords ON stops(stopLat, stopLon);
  `);

  return db;
}

// Baza otwiera się leniwie, przy pierwszym użyciu - bez top-level await
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabase();
  }
  return databasePromise;
}
