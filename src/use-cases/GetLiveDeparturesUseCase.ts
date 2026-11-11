// src/use-cases/GetLiveDeparturesUseCase.ts
import { Departure } from "../domain/entities/Departure";
import { IZtmApiRepository } from "../domain/repositories/IZtmApiRepository";
import { RouteNumber } from "../domain/value-objects/RouteNumber";

export class GetLiveDeparturesUseCase {
  constructor(private readonly apiRepository: IZtmApiRepository) {}

  public async execute(stopId: number): Promise<Departure[]> {
    const departures = await this.apiRepository.fetchDepartures(stopId);
    const now = Date.now();

    return departures
      .filter((dep) => {
        const timeString = dep.estimatedTime || dep.theoreticalTime;
        if (!timeString) return true;

        let depTimestamp: number;

        if (timeString.includes("T")) {
          depTimestamp = new Date(timeString).getTime();
        } else {
          const [hours, minutes] = timeString.split(":").map(Number);
          const depDate = new Date();
          depDate.setHours(hours, minutes, 0, 0);
          depTimestamp = depDate.getTime();
        }

        const diffInMinutes = (depTimestamp - now) / (1000 * 60);
        return diffInMinutes >= -2;
      })
      .map((dep) => ({
        ...dep,

        routeId: new RouteNumber(dep.routeId).value,
      }));
  }
}
