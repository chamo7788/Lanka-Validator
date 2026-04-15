export type NICType = 'Old' | 'New';
export type NICGender = 'Male' | 'Female';

export interface NICDecodeResult {
  isValid: boolean;
  type: NICType;
  gender: NICGender;
  birthday: Date;
  isVoter?: boolean;
}

export class NIC {
  private static readonly OLD_NIC_REGEX = /^\d{9}[VvXx]$/;
  private static readonly NEW_NIC_REGEX = /^\d{12}$/;

  public static decode(nicString: string): NICDecodeResult {
    const nic = nicString.trim();

    if (!this.OLD_NIC_REGEX.test(nic) && !this.NEW_NIC_REGEX.test(nic)) {
      throw new Error('Invalid NIC Format');
    }

    const isOld = this.OLD_NIC_REGEX.test(nic);
    const type: NICType = isOld ? 'Old' : 'New';

    const year = isOld ? 1900 + Number(nic.slice(0, 2)) : Number(nic.slice(0, 4));
    const rawDayComponent = isOld ? Number(nic.slice(2, 5)) : Number(nic.slice(4, 7));

    if (rawDayComponent < 1 || rawDayComponent > 866) {
      throw new Error('Invalid NIC day component');
    }

    const gender: NICGender = rawDayComponent > 500 ? 'Female' : 'Male';
    const dayOfYear = rawDayComponent > 500 ? rawDayComponent - 500 : rawDayComponent;

    const maxDayOfYear = this.isLeapYear(year) ? 366 : 365;
    if (dayOfYear < 1 || dayOfYear > maxDayOfYear) {
      throw new Error('Invalid NIC date component');
    }

    const birthday = this.dateFromDayOfYear(year, dayOfYear);

    const result: NICDecodeResult = {
      isValid: true,
      type,
      gender,
      birthday,
    };

    if (isOld) {
      const suffix = nic.charAt(9).toUpperCase();
      result.isVoter = suffix === 'V';
    }

    return result;
  }

  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  private static dateFromDayOfYear(year: number, dayOfYear: number): Date {
    const monthDays = [
      31,
      this.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    let remainingDays = dayOfYear;
    let monthIndex = 0;

    while (monthIndex < monthDays.length && remainingDays > monthDays[monthIndex]) {
      remainingDays -= monthDays[monthIndex];
      monthIndex += 1;
    }

    return new Date(year, monthIndex, remainingDays);
  }
}
