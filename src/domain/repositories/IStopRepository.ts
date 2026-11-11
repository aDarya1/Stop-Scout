// src/domain/repositories/IStopRepository.ts
import { Stop } from "../entities/Stop";

export interface IStopRepository {
  initDatabase(): Promise<void>;
  getAllStops(): Promise<Stop[]>;
  saveStops(stops: Stop[]): Promise<void>;
  getVisibleStops(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
  ): Promise<Stop[]>;

  getFavorites(userId: string): Promise<Stop[]>;
  saveFavorite(userId: string, stop: Stop): Promise<void>;
  removeFavorite(userId: string, stopId: number): Promise<void>;
  updateFavoriteNote(
    userId: string,
    stopId: number,
    note: string,
  ): Promise<void>;
}
