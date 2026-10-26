// src/domain/entities/Departure.ts
export interface Departure {
  id?: string;
  routeId: number | string;
  headsign: string;
  theoreticalTime: string;
  estimatedTime?: string;
  delayInSeconds: number | null;
}
