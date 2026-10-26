// src/use-cases/LoginUserUseCase.ts
import { User } from "../domain/entities/User";
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { IPasswordHasher } from "../domain/repositories/IPasswordHasher";

export class LoginUserUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async execute(username: string, plainPassword: string): Promise<User> {
    const user = await this.authRepository.findByUsername(username.trim());
    if (!user) {
      throw new Error("Nieprawidłowy login lub hasło.");
    }

    const isValid = this.passwordHasher.verify(
      plainPassword,
      user.passwordHash,
    );
    if (!isValid) {
      throw new Error("Nieprawidłowy login lub hasło.");
    }

    return user;
  }
}
