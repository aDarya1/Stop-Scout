// src/domain/entities/Stop.ts
import { Coordinates } from "../value-objects/Coordinates";

export class Stop {
  public readonly stopId: number;
  public readonly stopName: string;
  public readonly coordinates: Coordinates;
  public readonly stopDesc?: string;
  public readonly notes?: string;

  constructor(
    stopId: number,
    stopName: string,
    coordinates: Coordinates,
    stopDesc?: string,
    notes?: string,
  ) {
    if (stopId <= 0) {
      throw new Error("Identyfikator przystanku musi być większy od zera.");
    }
    if (!stopName.trim()) {
      throw new Error("Nazwa przystanku nie może być pusta.");
    }

    this.stopId = stopId;
    this.stopName = stopName;
    this.coordinates = coordinates;
    this.stopDesc = stopDesc;
    this.notes = notes;
  }

  public distanceToInMeters(target: Coordinates): number {
    return this.coordinates.distanceToInMeters(target);
  }

  // Encja jest niezmienna - zmiana notatki zwraca nowy przystanek
  public withNotes(notes: string): Stop {
    return new Stop(
      this.stopId,
      this.stopName,
      this.coordinates,
      this.stopDesc,
      notes,
    );
  }

  // Encje są równe, gdy mają ten sam identyfikator
  public equals(other: Stop | null | undefined): boolean {
    if (!other) return false;
    return this.stopId === other.stopId;
  }
}
