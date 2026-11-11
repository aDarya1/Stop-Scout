// src/domain/entities/Departure.ts
import { DepartureDelay } from "../value-objects/DepartureDelay";
import { RouteNumber } from "../value-objects/RouteNumber";

export class Departure {
  public readonly id: string;
  public readonly routeNumber: RouteNumber;
  public readonly headsign: string;
  public readonly theoreticalTime: string;
  public readonly estimatedTime?: string;
  public readonly delay: DepartureDelay;

  constructor(
    id: string,
    rawRouteId: number | string | null | undefined,
    headsign: string,
    theoreticalTime: string,
    estimatedTime?: string,
    rawDelayInSeconds?: number | null,
  ) {
    this.id = id;
    this.routeNumber = new RouteNumber(rawRouteId);
    this.headsign = headsign;
    this.theoreticalTime = theoreticalTime;
    this.estimatedTime = estimatedTime;
    this.delay = new DepartureDelay(rawDelayInSeconds);
  }

  // Encje są równe, gdy mają ten sam identyfikator
  public equals(other: Departure | null | undefined): boolean {
    if (!other) return false;
    return this.id === other.id;
  }
}
