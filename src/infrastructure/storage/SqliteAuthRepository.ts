// src/infrastructure/storage/SqliteAuthRepository.ts
import { User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { getDatabase } from "./SqliteDatabase";

export class SqliteAuthRepository implements IAuthRepository {
  async findByUsername(username: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.getFirstAsync<User>(
      "SELECT id, username, passwordHash FROM users WHERE username = ?",
      [username],
    );
    return user || null;
  }

  async createUser(user: User): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "INSERT INTO users (id, username, passwordHash) VALUES (?, ?, ?)",
      [user.id, user.username, user.passwordHash],
    );
  }
}
