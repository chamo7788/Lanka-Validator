export type MobileProvider = 'Dialog' | 'Mobitel' | 'Hutch' | 'Airtel';

export class Mobile {
  private static readonly LOCAL_REGEX = /^0(70|71|72|75|76|77|78)\d{7}$/;

  private static readonly PROVIDER_BY_PREFIX: Record<string, MobileProvider> = {
    '70': 'Mobitel',
    '71': 'Mobitel',
    '72': 'Hutch',
    '75': 'Airtel',
    '76': 'Dialog',
    '77': 'Dialog',
    '78': 'Hutch',
  };

  public static format(phoneNumber: string): string {
    const local = this.toLocalFormat(phoneNumber);
    return `+94${local.slice(1)}`;
  }

  public static getProvider(phoneNumber: string): MobileProvider {
    const local = this.toLocalFormat(phoneNumber);
    const provider = this.PROVIDER_BY_PREFIX[local.slice(1, 3)];

    if (!provider) {
      throw new Error('Unsupported mobile prefix');
    }

    return provider;
  }

  private static toLocalFormat(phoneNumber: string): string {
    const compact = phoneNumber.trim().replace(/[\s-]/g, '');

    let local: string;

    if (/^0\d{9}$/.test(compact)) {
      local = compact;
    } else if (/^94\d{9}$/.test(compact)) {
      local = `0${compact.slice(2)}`;
    } else if (/^\+94\d{9}$/.test(compact)) {
      local = `0${compact.slice(3)}`;
    } else {
      throw new Error('Invalid mobile number format');
    }

    if (!this.LOCAL_REGEX.test(local)) {
      throw new Error('Invalid Sri Lankan mobile number');
    }

    return local;
  }
}
