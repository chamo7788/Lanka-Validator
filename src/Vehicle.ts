export interface VehicleValidationResult {
  isValid: boolean;
  province: string;
  number: string;
}

export class Vehicle {
  private static readonly MODERN_REGEX = /^(WP|CP|SP|NP|EP|NW|NC|UV|SG)\s+([A-Z]{2,3})-(\d{4})$/;
  private static readonly OLD_REGEX = /^([A-Z]{2})-(\d{4})$/;

  public static validate(plateNumber: string): VehicleValidationResult {
    const normalized = plateNumber.trim().toUpperCase();

    const modernMatch = normalized.match(this.MODERN_REGEX);
    if (modernMatch) {
      return {
        isValid: true,
        province: modernMatch[1],
        number: modernMatch[3],
      };
    }

    const oldMatch = normalized.match(this.OLD_REGEX);
    if (oldMatch) {
      return {
        isValid: true,
        province: '',
        number: oldMatch[2],
      };
    }

    return {
      isValid: false,
      province: '',
      number: '',
    };
  }
}