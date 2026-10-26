// src/infrastructure/storage/SqliteStopRepository.ts
import * as SQLite from "expo-sqlite";
import { Stop } from "../../domain/entities/Stop";
import { IStopRepository } from "../../domain/repositories/IStopRepository";

export class SqliteStopRepository implements IStopRepository {
  private dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = (async () => {
        const db = await SQLite.openDatabaseAsync("stopscout.db");

        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS stops (
            stopId INTEGER PRIMARY KEY NOT NULL,
            stopName TEXT NOT NULL,
            stopDesc TEXT,
            stopLat REAL NOT NULL,
            stopLon REAL NOT NULL
          );
        `);
        return db;
      })();
    }
    return this.dbPromise;
  }

  async getAllStops(): Promise<Stop[]> {
    const db = await this.getDb();
    return await db.getAllAsync<Stop>("SELECT * FROM stops");
  }

  async saveStops(stops: Stop[]): Promise<void> {
    const db = await this.getDb();

    await db.withTransactionAsync(async () => {
      for (const stop of stops) {
        await db.runAsync(
          "INSERT OR REPLACE INTO stops (stopId, stopName, stopDesc, stopLat, stopLon) VALUES (?, ?, ?, ?, ?)",
          [
            stop.stopId,
            stop.stopName,
            stop.stopDesc || null,
            stop.stopLat,
            stop.stopLon,
          ],
        );
      }
    });
  }

  async getVisibleStops(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
  ): Promise<Stop[]> {
    const db = await this.getDb();
    return await db.getAllAsync<Stop>(
      "SELECT * FROM stops WHERE stopLat BETWEEN ? AND ? AND stopLon BETWEEN ? AND ?",
      [minLat, maxLat, minLon, maxLon],
    );
  }
}
