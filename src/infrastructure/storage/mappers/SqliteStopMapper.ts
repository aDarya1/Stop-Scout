// src/infrastructure/storage/mappers/SqliteStopMapper.ts
import { Stop } from "../../../domain/entities/Stop";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { SqliteStopRowDto } from "../dto/SqliteStopRowDto";

export class SqliteStopMapper {
  public static toEntity(row: SqliteStopRowDto): Stop {
    return new Stop(
      row.stopId,
      row.stopName,
      new Coordinates(row.stopLat, row.stopLon),
      row.stopDesc ?? undefined,
      row.notes ?? undefined,
    );
  }

  public static toRow(stop: Stop): SqliteStopRowDto {
    return {
      stopId: stop.stopId,
      stopName: stop.stopName,
      stopDesc: stop.stopDesc ?? null,
      stopLat: stop.coordinates.latitude,
      stopLon: stop.coordinates.longitude,
      notes: stop.notes ?? null,
    };
  }
}
