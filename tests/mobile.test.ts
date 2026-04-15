import { describe, expect, it } from 'vitest';

import { Mobile } from '../src';

describe('Mobile.format', () => {
  it('formats local format to international format', () => {
    expect(Mobile.format('0771234567')).toBe('+94771234567');
  });

  it('formats international format without plus', () => {
    expect(Mobile.format('94771234567')).toBe('+94771234567');
  });

  it('formats international format with plus', () => {
    expect(Mobile.format('+94771234567')).toBe('+94771234567');
  });

  it('throws for invalid mobile number', () => {
    expect(() => Mobile.format('0112345678')).toThrowError('Invalid Sri Lankan mobile number');
  });
});

describe('Mobile.getProvider', () => {
  it('returns Dialog for 077 and 076 prefixes', () => {
    expect(Mobile.getProvider('0771234567')).toBe('Dialog');
    expect(Mobile.getProvider('+94761234567')).toBe('Dialog');
  });

  it('returns Mobitel for 071 and 070 prefixes', () => {
    expect(Mobile.getProvider('0711234567')).toBe('Mobitel');
    expect(Mobile.getProvider('94701234567')).toBe('Mobitel');
  });

  it('returns Hutch for 072 and 078 prefixes', () => {
    expect(Mobile.getProvider('0721234567')).toBe('Hutch');
    expect(Mobile.getProvider('+94781234567')).toBe('Hutch');
  });

  it('returns Airtel for 075 prefix', () => {
    expect(Mobile.getProvider('0751234567')).toBe('Airtel');
  });

  it('throws for invalid format', () => {
    expect(() => Mobile.getProvider('771234567')).toThrowError('Invalid mobile number format');
  });
});
