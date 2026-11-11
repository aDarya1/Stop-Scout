// src/use-cases/GetLiveDeparturesUseCase.ts
import { Departure } from "../domain/entities/Departure";
import { IZtmApiRepository } from "../domain/repositories/IZtmApiRepository";

const MAX_MINUTES_IN_PAST = 2;

export class GetLiveDeparturesUseCase {
  constructor(private readonly apiRepository: IZtmApiRepository) {}

  public async execute(stopId: number): Promise<Departure[]> {
    const departures = await this.apiRepository.fetchDepartures(stopId);
    const now = Date.now();

    return departures.filter((departure) => {
      const timestamp = this.getTimestamp(departure);

      // Odjazdu bez czytelnej godziny nie wyrzucamy z listy
      if (timestamp === null) return true;

      const diffInMinutes = (timestamp - now) / (1000 * 60);
      return diffInMinutes >= -MAX_MINUTES_IN_PAST;
    });
  }

  private getTimestamp(departure: Departure): number | null {
    const timeString = departure.estimatedTime || departure.theoreticalTime;
    if (!timeString) return null;

    let timestamp: number;

    if (timeString.includes("T") || timeString.includes("-")) {
      // Pełna data ISO-8601 w UTC, np. "2026-10-26T21:57:00Z"
      timestamp = new Date(timeString).getTime();
    } else {
      // Sama godzina "HH:MM" - traktujemy jako dzisiejszą
      const [hours, minutes] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      timestamp = date.getTime();
    }

    return Number.isNaN(timestamp) ? null : timestamp;
  }
}
