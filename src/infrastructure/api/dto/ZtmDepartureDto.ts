// src/infrastructure/api/dto/ZtmDepartureDto.ts
export interface ZtmDepartureDto {
  id?: string;
  routeId: number | string;
  headsign: string;
  theoreticalTime: string;
  estimatedTime?: string;
  delayInSeconds?: number | null;
}
