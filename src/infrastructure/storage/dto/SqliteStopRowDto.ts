// src/infrastructure/storage/dto/SqliteStopRowDto.ts
export interface SqliteStopRowDto {
  stopId: number;
  stopName: string;
  stopDesc: string | null;
  stopLat: number;
  stopLon: number;
  notes?: string | null;
}
