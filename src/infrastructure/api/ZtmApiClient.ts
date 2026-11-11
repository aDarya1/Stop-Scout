// src/infrastructure/api/ZtmApiClient.ts
import { Departure } from "../../domain/entities/Departure";
import { Stop } from "../../domain/entities/Stop";
import { IZtmApiRepository } from "../../domain/repositories/IZtmApiRepository";
import { ZtmDepartureDto } from "./dto/ZtmDepartureDto";
import { ZtmStopDto } from "./dto/ZtmStopDto";
import { ZtmApiMapper } from "./mappers/ZtmApiMapper";

export class ZtmApiClient implements IZtmApiRepository {
  private readonly STOPS_URL =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";
  private readonly DEPARTURES_URL =
    "https://ckan2.multimediagdansk.pl/departures?stopId=";

  async fetchStopsFromApi(): Promise<Stop[]> {
    const response = await fetch(this.STOPS_URL);
    if (!response.ok) {
      throw new Error(
        `Nie udało się pobrać przystanków (HTTP ${response.status}).`,
      );
    }

    // Pierwszy klucz w pliku to data, a pod nią leży tablica "stops"
    const data: Record<string, { stops: ZtmStopDto[] }> =
      await response.json();
    const dateKey = Object.keys(data)[0];

    return data[dateKey].stops
      .filter((dto) => dto.stopId && dto.stopLat && dto.stopLon)
      .map((dto) => ZtmApiMapper.toStopEntity(dto));
  }

  async fetchDepartures(stopId: number): Promise<Departure[]> {
    const response = await fetch(`${this.DEPARTURES_URL}${stopId}`);
    if (!response.ok) {
      throw new Error(
        `Nie udało się pobrać odjazdów (HTTP ${response.status}).`,
      );
    }

    const data: { departures?: ZtmDepartureDto[] } = await response.json();
    const rawDepartures = data.departures ?? [];

    return rawDepartures.map((dto, index) =>
      ZtmApiMapper.toDepartureEntity(dto, index),
    );
  }
}
