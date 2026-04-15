# Lanka Validator

A framework-agnostic JavaScript/TypeScript utility library for validating and extracting Sri Lankan-specific data formats.

## Features

- Validate and decode Sri Lankan NIC numbers (old and new formats)
- Extract NIC metadata:
  - NIC type (`Old` or `New`)
  - Gender (`Male` or `Female`)
  - Date of birth
  - Voter status for old NIC format (`V` or `X`)
- Validate and normalize Sri Lankan mobile numbers
  - Accepts local (`07XXXXXXXX`), international (`947XXXXXXXX`), and plus format (`+947XXXXXXXX`)
  - Outputs normalized `+94` format
- Detect mobile network provider from number prefix
  - Dialog, Mobitel, Hutch, Airtel
- Validate Sri Lankan vehicle registration numbers
  - Modern format with province code (e.g., `WP CAB-1234`, `CP JS-5678`)
  - Old 2-letter format (e.g., `KA-1234`)
- TypeScript-first with exported types
- Tested with Vitest

## Installation

```bash
npm install lanka-validator
```

## Quick Start

```ts
import { NIC, Mobile, Vehicle } from 'lanka-validator';

const nic = NIC.decode('901231234V');
const normalizedMobile = Mobile.format('0771234567');
const provider = Mobile.getProvider('+94771234567');
const plate = Vehicle.validate('WP CAB-1234');

console.log({ nic, normalizedMobile, provider, plate });
```

## API Reference

### NIC

#### `NIC.decode(nic: string): NICDecodeResult`

Validates and decodes old/new NIC values.

Supported formats:
- Old NIC: `123456789V` / `123456789X`
- New NIC: `200012300123` (12 digits)

Returns:
- `isValid: true`
- `type: 'Old' | 'New'`
- `gender: 'Male' | 'Female'`
- `birthday: Date`
- `isVoter?: boolean` (only for old NIC)

Throws errors:
- `Invalid NIC Format`
- `Invalid NIC day component`
- `Invalid NIC date component`

Example:

```ts
import { NIC } from 'lanka-validator';

const result = NIC.decode('925781234X');

// {
//   isValid: true,
//   type: 'Old',
//   gender: 'Female',
//   birthday: Date(...),
//   isVoter: false
// }
console.log(result);
```

### Mobile

#### `Mobile.format(phoneNumber: string): string`

Normalizes valid Sri Lankan mobile numbers to international `+94` format.

Accepted inputs:
- `0771234567`
- `94771234567`
- `+94771234567`

Throws errors:
- `Invalid mobile number format`
- `Invalid Sri Lankan mobile number`

Example:

```ts
import { Mobile } from 'lanka-validator';

console.log(Mobile.format('0771234567'));   // +94771234567
console.log(Mobile.format('94771234567'));  // +94771234567
console.log(Mobile.format('+94771234567')); // +94771234567
```

#### `Mobile.getProvider(phoneNumber: string): MobileProvider`

Returns provider by prefix.

Provider mapping:
- `070`, `071` -> `Mobitel`
- `072`, `078` -> `Hutch`
- `075` -> `Airtel`
- `076`, `077` -> `Dialog`

Throws errors:
- `Invalid mobile number format`
- `Invalid Sri Lankan mobile number`
- `Unsupported mobile prefix`

Example:

```ts
import { Mobile } from 'lanka-validator';

console.log(Mobile.getProvider('0771234567'));  // Dialog
console.log(Mobile.getProvider('0711234567'));  // Mobitel
console.log(Mobile.getProvider('+94781234567')); // Hutch
console.log(Mobile.getProvider('0751234567'));  // Airtel
```

### Vehicle

#### `Vehicle.validate(plateNumber: string): VehicleValidationResult`

Validates vehicle plate formats and returns parsed details.

Supported formats:
- Modern: `<PROVINCE> <SERIES>-<4DIGITS>`
  - Province codes: `WP`, `CP`, `SP`, `NP`, `EP`, `NW`, `NC`, `UV`, `SG`
  - Series: 2 or 3 letters
  - Example: `WP CAB-1234`, `CP JS-5678`
- Old format: `<2LETTERS>-<4DIGITS>`
  - Example: `KA-1234`

Returns:
- Valid modern:
  - `{ isValid: true, province: 'WP', number: '1234' }`
- Valid old:
  - `{ isValid: true, province: '', number: '1234' }`
- Invalid:
  - `{ isValid: false, province: '', number: '' }`

Example:

```ts
import { Vehicle } from 'lanka-validator';

console.log(Vehicle.validate('WP CAB-1234'));
console.log(Vehicle.validate('CP JS-5678'));
console.log(Vehicle.validate('KA-1234'));
console.log(Vehicle.validate('XX CAB-1234')); // invalid
```

## Example Use Cases

### 1. Sign-up form validation

```ts
import { NIC, Mobile } from 'lanka-validator';

function validateSignupInput(input: { nic: string; mobile: string }) {
  const nic = NIC.decode(input.nic);
  const mobile = Mobile.format(input.mobile);
  const provider = Mobile.getProvider(input.mobile);

  return {
    nic,
    mobile,
    provider,
  };
}
```

### 2. KYC preprocessing pipeline

```ts
import { NIC } from 'lanka-validator';

function buildKycRecord(nicValue: string) {
  const decoded = NIC.decode(nicValue);

  return {
    nicType: decoded.type,
    gender: decoded.gender,
    birthDateISO: decoded.birthday.toISOString().slice(0, 10),
    isVoter: decoded.isVoter ?? null,
  };
}
```

### 3. Logistics or fleet intake

```ts
import { Vehicle } from 'lanka-validator';

function acceptVehicle(plate: string) {
  const result = Vehicle.validate(plate);
  if (!result.isValid) {
    throw new Error('Vehicle number is invalid');
  }

  return {
    plate,
    province: result.province || 'N/A',
    number: result.number,
  };
}
```

### 4. Mobile provider analytics

```ts
import { Mobile } from 'lanka-validator';

function summarizeByProvider(numbers: string[]) {
  const counts: Record<string, number> = {};

  for (const number of numbers) {
    const provider = Mobile.getProvider(number);
    counts[provider] = (counts[provider] ?? 0) + 1;
  }

  return counts;
}
```

## Exported Types

```ts
import type {
  NICDecodeResult,
  NICGender,
  NICType,
  MobileProvider,
  VehicleValidationResult,
} from 'lanka-validator';
```

## Development

```bash
npm install
npm run build
npm test
npm run test:watch
```

## License

MIT
