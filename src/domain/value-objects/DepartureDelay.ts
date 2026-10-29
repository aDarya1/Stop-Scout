// src/domain/value-objects/DepartureDelay.ts
export type DelaySeverity = "ON_TIME" | "MINOR" | "MAJOR";

export class DepartureDelay {
  public readonly seconds: number;
  public readonly severity: DelaySeverity;
  public readonly formattedText: string;
  public readonly shouldAnimate: boolean;

  constructor(delayInSeconds: number | null | undefined) {
    this.seconds = delayInSeconds ?? 0;

    if (this.seconds <= 0) {
      this.severity = "ON_TIME";
      this.formattedText = "Na czas";
      this.shouldAnimate = false;
    } else if (this.seconds < 120) {
      this.severity = "MINOR";
      this.formattedText = `+${this.seconds}s`;
      this.shouldAnimate = false;
    } else {
      const minutes = Math.floor(this.seconds / 60);
      this.severity = "MAJOR";
      this.formattedText = `+${minutes} min`;
      this.shouldAnimate = true;
    }
  }

  public isDelayed(): boolean {
    return this.seconds > 0;
  }

  public equals(other: DepartureDelay | null | undefined): boolean {
    if (!other) return false;
    return this.seconds === other.seconds;
  }
}
