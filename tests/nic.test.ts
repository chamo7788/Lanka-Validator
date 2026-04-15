import { describe, expect, it } from 'vitest';

import { NIC } from '../src';

describe('NIC.decode', () => {
  it('decodes a valid old NIC and sets voter status', () => {
    const result = NIC.decode('901231234V');

    expect(result.isValid).toBe(true);
    expect(result.type).toBe('Old');
    expect(result.gender).toBe('Male');
    expect(result.isVoter).toBe(true);
    expect(result.birthday).toEqual(new Date(1990, 4, 3));
  });

  it('decodes a valid old NIC female and non-voter', () => {
    const result = NIC.decode('925781234X');

    expect(result.isValid).toBe(true);
    expect(result.type).toBe('Old');
    expect(result.gender).toBe('Female');
    expect(result.isVoter).toBe(false);
    expect(result.birthday).toEqual(new Date(1992, 2, 18));
  });

  it('decodes a valid new NIC male', () => {
    const result = NIC.decode('200012300123');

    expect(result.isValid).toBe(true);
    expect(result.type).toBe('New');
    expect(result.gender).toBe('Male');
    expect(result.isVoter).toBeUndefined();
    expect(result.birthday).toEqual(new Date(2000, 4, 2));
  });

  it('decodes a valid new NIC female', () => {
    const result = NIC.decode('200156000123');

    expect(result.isValid).toBe(true);
    expect(result.type).toBe('New');
    expect(result.gender).toBe('Female');
    expect(result.isVoter).toBeUndefined();
    expect(result.birthday).toEqual(new Date(2001, 2, 1));
  });

  it('throws for invalid NIC format', () => {
    expect(() => NIC.decode('12345')).toThrowError('Invalid NIC Format');
  });

  it('throws for invalid day component range', () => {
    expect(() => NIC.decode('900001234V')).toThrowError('Invalid NIC day component');
  });

  it('throws for invalid date component in non-leap year', () => {
    expect(() => NIC.decode('200136700001')).toThrowError('Invalid NIC date component');
  });
});
