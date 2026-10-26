// src/domain/repositories/IPasswordHasher.ts
export interface IPasswordHasher {
  hash(plainText: string): string;
  verify(plainText: string, hash: string): boolean;
}
