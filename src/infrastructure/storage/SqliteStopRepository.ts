// src/infrastructure/storage/SqliteStopRepository.ts
import { Stop } from "../../domain/entities/Stop";
import { IStopRepository } from "../../domain/repositories/IStopRepository";
import { SqliteStopRowDto } from "./dto/SqliteStopRowDto";
import { SqliteStopMapper } from "./mappers/SqliteStopMapper";
import { getDatabase } from "./SqliteDatabase";

export class SqliteStopRepository implements IStopRepository {
  async initDatabase(): Promise<void> {
    await getDatabase();
  }

  async getAllStops(): Promise<Stop[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<SqliteStopRowDto>(
      "SELECT stopId, stopName, stopDesc, stopLat, stopLon FROM stops",
    );
    return rows.map(SqliteStopMapper.toEntity);
  }

  async saveStops(stops: Stop[]): Promise<void> {
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      for (const stop of stops) {
        const row = SqliteStopMapper.toRow(stop);
        await db.runAsync(
          "INSERT OR REPLACE INTO stops (stopId, stopName, stopDesc, stopLat, stopLon) VALUES (?, ?, ?, ?, ?)",
          [row.stopId, row.stopName, row.stopDesc, row.stopLat, row.stopLon],
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
    const db = await getDatabase();
    const rows = await db.getAllAsync<SqliteStopRowDto>(
      "SELECT stopId, stopName, stopDesc, stopLat, stopLon FROM stops WHERE stopLat BETWEEN ? AND ? AND stopLon BETWEEN ? AND ?",
      [minLat, maxLat, minLon, maxLon],
    );
    return rows.map(SqliteStopMapper.toEntity);
  }

  async getFavorites(userId: string): Promise<Stop[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<SqliteStopRowDto>(
      "SELECT stopId, stopName, NULL as stopDesc, stopLat, stopLon, notes FROM favorites WHERE userId = ?",
      [userId],
    );
    return rows.map(SqliteStopMapper.toEntity);
  }

  async saveFavorite(userId: string, stop: Stop): Promise<void> {
    const db = await getDatabase();
    const row = SqliteStopMapper.toRow(stop);
    await db.runAsync(
      "INSERT OR REPLACE INTO favorites (userId, stopId, stopName, stopLat, stopLon, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userId,
        row.stopId,
        row.stopName,
        row.stopLat,
        row.stopLon,
        row.notes ?? null,
      ],
    );
  }

  async removeFavorite(userId: string, stopId: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM favorites WHERE userId = ? AND stopId = ?", [
      userId,
      stopId,
    ]);
  }

  async updateFavoriteNote(
    userId: string,
    stopId: number,
    note: string,
  ): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE favorites SET notes = ? WHERE userId = ? AND stopId = ?",
      [note, userId, stopId],
    );
  }
}
