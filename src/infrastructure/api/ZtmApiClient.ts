// src/infrastructure/api/ZtmApiClient.ts
import { Departure } from "../../domain/entities/Departure";
import { Stop } from "../../domain/entities/Stop";
import { IZtmApiRepository } from "../../domain/repositories/IZtmApiRepository";

export class ZtmApiClient implements IZtmApiRepository {
  private readonly STOPS_URL =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";
  private readonly DEPARTURES_URL =
    "https://ckan2.multimediagdansk.pl/departures?stopId=";

  async fetchStopsFromApi(): Promise<Stop[]> {
    const response = await fetch(this.STOPS_URL);
    const data = await response.json();

    const dateKey = Object.keys(data)[0];
    const rawStops = data[dateKey].stops;

    return rawStops.map((s: any) => ({
      stopId: s.stopId,
      stopName: s.stopName || s.stopDesc || `Przystanek #${s.stopId}`,
      stopDesc: s.stopDesc,
      stopLat: s.stopLat,
      stopLon: s.stopLon,
    }));
  }

  async fetchDepartures(stopId: number): Promise<Departure[]> {
    const response = await fetch(`${this.DEPARTURES_URL}${stopId}`);
    const data = await response.json();

    const rawDepartures = data.departures || [];

    return rawDepartures.map((d: any) => ({
      id: d.id || Math.random().toString(),
      routeId: d.routeId,
      headsign: d.headsign,
      theoreticalTime: d.theoreticalTime,
      estimatedTime: d.estimatedTime,
      delayInSeconds: d.delayInSeconds,
    }));
  }
}
