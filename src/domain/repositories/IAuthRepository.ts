// src/domain/repositories/IAuthRepository.ts
import { User } from "../entities/User";

export interface IAuthRepository {
  findByUsername(username: string): Promise<User | null>;
  createUser(user: User): Promise<void>;
}
