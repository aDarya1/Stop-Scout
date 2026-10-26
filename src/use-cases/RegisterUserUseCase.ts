// src/use-cases/RegisterUserUseCase.ts
import { User } from "../domain/entities/User";
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { IPasswordHasher } from "../domain/repositories/IPasswordHasher";

export class RegisterUserUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async execute(username: string, plainPassword: string): Promise<User> {
    const existing = await this.authRepository.findByUsername(username.trim());
    if (existing) {
      throw new Error("Użytkownik o podanym loginie już istnieje.");
    }

    const passwordHash = this.passwordHasher.hash(plainPassword);

    const newUser: User = {
      id: Date.now().toString(),
      username: username.trim(),
      passwordHash,
    };

    await this.authRepository.createUser(newUser);
    return newUser;
  }
}
