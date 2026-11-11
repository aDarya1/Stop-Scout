// src/di/container.ts
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { IPasswordHasher } from "../domain/repositories/IPasswordHasher";
import { IStopRepository } from "../domain/repositories/IStopRepository";
import { IZtmApiRepository } from "../domain/repositories/IZtmApiRepository";

import { ZtmApiClient } from "../infrastructure/api/ZtmApiClient";
import { BcryptPasswordHasher } from "../infrastructure/security/BcryptPasswordHasher";
import { SqliteAuthRepository } from "../infrastructure/storage/SqliteAuthRepository";
import { SqliteStopRepository } from "../infrastructure/storage/SqliteStopRepository";

import { GetLiveDeparturesUseCase } from "../use-cases/GetLiveDeparturesUseCase";
import { LoginUserUseCase } from "../use-cases/LoginUserUseCase";
import { RegisterUserUseCase } from "../use-cases/RegisterUserUseCase";
import { SyncStopsUseCase } from "../use-cases/SyncStopsUseCase";

class AppContainer {
  private _authRepo?: IAuthRepository;
  private _passwordHasher?: IPasswordHasher;
  private _stopRepo?: IStopRepository;
  private _ztmApi?: IZtmApiRepository;

  public get authRepository(): IAuthRepository {
    if (!this._authRepo) this._authRepo = new SqliteAuthRepository();
    return this._authRepo!; // <-- Добавлен !
  }

  public get passwordHasher(): IPasswordHasher {
    if (!this._passwordHasher)
      this._passwordHasher = new BcryptPasswordHasher();
    return this._passwordHasher!; // <-- Добавлен !
  }

  public get stopRepository(): IStopRepository {
    if (!this._stopRepo) this._stopRepo = new SqliteStopRepository();
    return this._stopRepo!; // <-- Добавлен !
  }

  public get ztmApiRepository(): IZtmApiRepository {
    if (!this._ztmApi) this._ztmApi = new ZtmApiClient();
    return this._ztmApi!; // <-- Добавлен !
  }

  public get registerUserUseCase(): RegisterUserUseCase {
    return new RegisterUserUseCase(this.authRepository, this.passwordHasher);
  }

  public get loginUserUseCase(): LoginUserUseCase {
    return new LoginUserUseCase(this.authRepository, this.passwordHasher);
  }

  public get syncStopsUseCase(): SyncStopsUseCase {
    return new SyncStopsUseCase(this.stopRepository, this.ztmApiRepository);
  }

  public get getLiveDeparturesUseCase(): GetLiveDeparturesUseCase {
    return new GetLiveDeparturesUseCase(this.ztmApiRepository);
  }
}

export const container = new AppContainer();
