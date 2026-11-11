// src/infrastructure/api/mappers/ZtmApiMapper.ts
import { Departure } from "../../../domain/entities/Departure";
import { Stop } from "../../../domain/entities/Stop";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { ZtmDepartureDto } from "../dto/ZtmDepartureDto";
import { ZtmStopDto } from "../dto/ZtmStopDto";

export class ZtmApiMapper {
  public static toStopEntity(dto: ZtmStopDto): Stop {
    // Część przystanków w API nie ma nazwy - bierzemy opis albo numer
    const name =
      dto.stopName?.trim() ||
      dto.stopDesc?.trim() ||
      `Przystanek #${dto.stopId}`;

    return new Stop(
      dto.stopId,
      name,
      new Coordinates(Number(dto.stopLat), Number(dto.stopLon)),
      dto.stopDesc ?? undefined,
    );
  }

  public static toDepartureEntity(
    dto: ZtmDepartureDto,
    index: number,
  ): Departure {
    // Ten sam odjazd zawsze dostaje to samo id (nie używamy losowości)
    const id = dto.id ?? `${dto.routeId}-${dto.theoreticalTime}-${index}`;

    return new Departure(
      id,
      dto.routeId,
      dto.headsign,
      dto.theoreticalTime,
      dto.estimatedTime,
      dto.delayInSeconds,
    );
  }
}
