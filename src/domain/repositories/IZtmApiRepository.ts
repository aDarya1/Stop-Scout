// src/domain/repositories/IZtmApiRepository.ts
import { Departure } from "../entities/Departure";
import { Stop } from "../entities/Stop";

export interface IZtmApiRepository {
  fetchStopsFromApi(): Promise<Stop[]>;
  fetchDepartures(stopId: number): Promise<Departure[]>;
}
