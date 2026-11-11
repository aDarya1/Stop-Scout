// src/infrastructure/api/dto/ZtmStopDto.ts
export interface ZtmStopDto {
  stopId: number;
  stopName: string | null;
  stopDesc: string | null;
  stopLat: number | string;
  stopLon: number | string;
}
