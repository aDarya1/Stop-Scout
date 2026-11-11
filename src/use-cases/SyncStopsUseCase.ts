// src/use-cases/SyncStopsUseCase.ts
import { IStopRepository } from "../domain/repositories/IStopRepository";
import { IZtmApiRepository } from "../domain/repositories/IZtmApiRepository";

export class SyncStopsUseCase {
  constructor(
    private readonly stopRepository: IStopRepository,
    private readonly apiRepository: IZtmApiRepository,
  ) {}

  public async execute(): Promise<void> {
    const localStops = await this.stopRepository.getAllStops();

    // Jeśli przystanki są już w bazie, nie pobieramy ich ponownie
    if (localStops.length > 0) {
      console.log(
        "Przystanki są już w pamięci podręcznej. Pobieranie nie jest wymagane.",
      );
      return;
    }

    console.log("Baza jest pusta. Pobieranie przystanków z API ZTM...");
    const apiStops = await this.apiRepository.fetchStopsFromApi();

    // Zapisujemy pobrane dane do lokalnej bazy SQLite
    await this.stopRepository.saveStops(apiStops);
    console.log(`Zapisano ${apiStops.length} przystanków.`);
  }
}
