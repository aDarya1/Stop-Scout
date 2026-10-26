// src/di/container.ts
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { IPasswordHasher } from "../domain/repositories/IPasswordHasher";
import { BcryptPasswordHasher } from "../infrastructure/security/BcryptPasswordHasher";
import { SqliteAuthRepository } from "../infrastructure/storage/SqliteAuthRepository";
import { LoginUserUseCase } from "../use-cases/LoginUserUseCase";
import { RegisterUserUseCase } from "../use-cases/RegisterUserUseCase";

class AppContainer {
  private _authRepo?: IAuthRepository;
  private _passwordHasher?: IPasswordHasher;

  public get authRepository(): IAuthRepository {
    if (!this._authRepo) this._authRepo = new SqliteAuthRepository();
    return this._authRepo;
  }

  public get passwordHasher(): IPasswordHasher {
    if (!this._passwordHasher)
      this._passwordHasher = new BcryptPasswordHasher();
    return this._passwordHasher;
  }

  public get registerUserUseCase(): RegisterUserUseCase {
    return new RegisterUserUseCase(this.authRepository, this.passwordHasher);
  }

  public get loginUserUseCase(): LoginUserUseCase {
    return new LoginUserUseCase(this.authRepository, this.passwordHasher);
  }
}

export const container = new AppContainer();
