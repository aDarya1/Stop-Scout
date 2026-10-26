// src/domain/entities/Stop.ts
export interface Stop {
  stopId: number;
  stopName: string;
  stopDesc?: string;
  stopLat: number;
  stopLon: number;
}
