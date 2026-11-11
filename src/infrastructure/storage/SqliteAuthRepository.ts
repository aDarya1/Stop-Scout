// src/infrastructure/storage/SqliteAuthRepository.ts
import * as SQLite from "expo-sqlite";
import { User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class SqliteAuthRepository implements IAuthRepository {
  private dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = (async () => {
        const db = await SQLite.openDatabaseAsync("stopscout.db");
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY NOT NULL,
            username TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL
          );
        `);
        return db;
      })();
    }
    return this.dbPromise;
  }

  async findByUsername(username: string): Promise<User | null> {
    const db = await this.getDb();
    const user = await db.getFirstAsync<User>(
      "SELECT id, username, passwordHash FROM users WHERE username = ?",
      [username],
    );
    return user || null;
  }

  async createUser(user: User): Promise<void> {
    const db = await this.getDb();
    await db.runAsync(
      "INSERT INTO users (id, username, passwordHash) VALUES (?, ?, ?)",
      [user.id, user.username, user.passwordHash],
    );
  }
}
