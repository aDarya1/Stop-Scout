// src/domain/repositories/IStopRepository.ts
import { Stop } from "../entities/Stop";

export interface IStopRepository {
  getAllStops(): Promise<Stop[]>;
  saveStops(stops: Stop[]): Promise<void>;
  getVisibleStops(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
  ): Promise<Stop[]>;
}
