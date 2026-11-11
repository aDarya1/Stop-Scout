// src/domain/value-objects/Coordinates.ts
const EARTH_RADIUS_IN_METERS = 6371000;

export class Coordinates {
  public readonly latitude: number;
  public readonly longitude: number;

  constructor(latitude: number, longitude: number) {
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      throw new Error("Szerokość geograficzna musi być w zakresie -90..90.");
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new Error("Długość geograficzna musi być w zakresie -180..180.");
    }

    this.latitude = latitude;
    this.longitude = longitude;
  }

  // Wzór haversine: odległość w linii prostej po powierzchni Ziemi
  public distanceToInMeters(target: Coordinates): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const deltaLat = toRadians(target.latitude - this.latitude);
    const deltaLon = toRadians(target.longitude - this.longitude);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(toRadians(this.latitude)) *
        Math.cos(toRadians(target.latitude)) *
        Math.sin(deltaLon / 2) ** 2;

    return 2 * EARTH_RADIUS_IN_METERS * Math.asin(Math.sqrt(a));
  }

  public equals(other: Coordinates | null | undefined): boolean {
    if (!other) return false;
    return (
      this.latitude === other.latitude && this.longitude === other.longitude
    );
  }
}
