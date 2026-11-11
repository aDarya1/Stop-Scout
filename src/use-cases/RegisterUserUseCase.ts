// src/use-cases/RegisterUserUseCase.ts
import { User } from "../domain/entities/User";
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { IPasswordHasher } from "../domain/repositories/IPasswordHasher";

const MIN_PASSWORD_LENGTH = 4;

export class RegisterUserUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async execute(username: string, plainPassword: string): Promise<User> {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      throw new Error("Login nie może być pusty.");
    }
    if (plainPassword.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaki.`,
      );
    }

    const existing = await this.authRepository.findByUsername(trimmedUsername);
    if (existing) {
      throw new Error("Użytkownik o podanym loginie już istnieje.");
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: trimmedUsername,
      passwordHash: this.passwordHasher.hash(plainPassword),
    };

    await this.authRepository.createUser(newUser);
    return newUser;
  }
}
