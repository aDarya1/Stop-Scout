// src/infrastructure/security/BcryptPasswordHasher.ts
import bcrypt from "bcryptjs";
import * as Crypto from "expo-crypto";
import { IPasswordHasher } from "../../domain/repositories/IPasswordHasher";

// Без этого Hermes (движок JS на телефоне) выдаст ошибку
bcrypt.setRandomFallback((len: number) => {
  const array = new Uint8Array(len);
  Crypto.getRandomValues(array);
  return Array.from(array);
});

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  public hash(plainText: string): string {
    const salt = bcrypt.genSaltSync(this.saltRounds);
    return bcrypt.hashSync(plainText, salt);
  }

  public verify(plainText: string, hash: string): boolean {
    return bcrypt.compareSync(plainText, hash);
  }
}
