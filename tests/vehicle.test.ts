import { describe, expect, it } from 'vitest';

import { Vehicle } from '../src';

describe('Vehicle.validate', () => {
  it('validates modern format with 3-letter series', () => {
    const result = Vehicle.validate('WP CAB-1234');

    expect(result).toEqual({
      isValid: true,
      province: 'WP',
      number: '1234',
    });
  });

  it('validates modern format with 2-letter series', () => {
    const result = Vehicle.validate('CP JS-5678');

    expect(result).toEqual({
      isValid: true,
      province: 'CP',
      number: '5678',
    });
  });

  it('supports old 2-letter format', () => {
    const result = Vehicle.validate('KA-1234');

    expect(result).toEqual({
      isValid: true,
      province: '',
      number: '1234',
    });
  });

  it('rejects invalid province code', () => {
    const result = Vehicle.validate('XX CAB-1234');

    expect(result).toEqual({
      isValid: false,
      province: '',
      number: '',
    });
  });

  it('rejects non-4-digit numbers', () => {
    const result = Vehicle.validate('WP CAB-123');

    expect(result).toEqual({
      isValid: false,
      province: '',
      number: '',
    });
  });
});