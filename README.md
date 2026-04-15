# Lanka Validator

[![NPM Version](https://img.shields.io/npm/v/lanka-validator.svg)](https://www.npmjs.com/package/lanka-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lanka Validator is a lightweight, framework-agnostic utility library built to handle Sri Lankan data formats. Whether you are building an e-commerce checkout, a KYC pipeline, or a simple contact form, this library helps keep your input data accurate and standardized.

---

## Key Features

- Smart NIC Decoding: Supports both old (9-digit + suffix) and new (12-digit) formats.
- Information Extraction: Retrieves birthday, gender, NIC type, and voter flag for old NIC values.
- Mobile Normalization: Standardizes valid Sri Lankan mobile numbers to international `+94` format.
- Carrier Detection: Identifies providers (Dialog, Mobitel, Hutch, Airtel) from prefixes.
- Vehicle Plate Validation: Supports modern province-based and old vehicle number formats.
- Fully Typed: First-class TypeScript support for a safer developer experience.
- Ultra Lightweight: No runtime dependencies.

---

## Quick Start

### Installation

```bash
npm install lanka-validator
```

### Basic Usage

```ts
import { NIC, Mobile, Vehicle } from 'lanka-validator';

// NIC decoding
const nicInfo = NIC.decode('951234567V');
// { isValid: true, type: 'Old', gender: 'Male', birthday: Date(...), isVoter: true }

// Mobile formatting and provider detection
const formatted = Mobile.format('0771234567'); // "+94771234567"
const network = Mobile.getProvider('0771234567'); // "Dialog"

// Vehicle validation
const car = Vehicle.validate('WP CAB-1234');
// { isValid: true, province: 'WP', number: '1234' }
```

---

## Detailed API Reference

### 1. National Identity Card (NIC)

The `NIC` module handles date decoding, leap-year validation, and the gender offset rule (`+500` day component).

| Method | Input | Returns |
| :--- | :--- | :--- |
| `decode(nic)` | `string` | `NICDecodeResult` |

Supported formats:

- Old: `951234567V` / `951234567X`
- New: `199512304567` (12 digits)

Errors:

- `Invalid NIC Format`
- `Invalid NIC day component`
- `Invalid NIC date component`

---

### 2. Mobile Numbers

Use these methods to clean user input and identify carriers.

| Method | Input | Returns |
| :--- | :--- | :--- |
| `format(phone)` | `string` | Normalized `+947XXXXXXXX` |
| `getProvider(phone)` | `string` | `Dialog` \| `Mobitel` \| `Hutch` \| `Airtel` |

Carrier prefix map:

- `070`, `071` -> Mobitel
- `076`, `077` -> Dialog
- `072`, `078` -> Hutch
- `075` -> Airtel

Errors:

- `Invalid mobile number format`
- `Invalid Sri Lankan mobile number`
- `Unsupported mobile prefix`

---

### 3. Vehicle Numbers

Validates plate format and extracts province and number.

Example formats:

- `WP CAB-1234` (modern province-based)
- `KA-1234` (old format)

Returns:

- Valid modern: `{ isValid: true, province: 'WP', number: '1234' }`
- Valid old: `{ isValid: true, province: '', number: '1234' }`
- Invalid: `{ isValid: false, province: '', number: '' }`

---

## Real-World Example

### Sign-up Form Validation (React/Node.js)

```ts
import { NIC, Mobile } from 'lanka-validator';

const handleSubmit = (data: { phone: string; nic: string }) => {
  try {
    const validMobile = Mobile.format(data.phone);
    const nicDetails = NIC.decode(data.nic);

    // Proceed with sanitized data
    console.log('Verified User:', {
      phone: validMobile,
      dob: nicDetails.birthday,
    });
  } catch (error) {
    alert('Please check your Sri Lankan identity details!');
  }
};
```

---

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

---

## Development and Testing

This project uses Vitest for test coverage of validation logic.

```bash
# Install dependencies
npm install

# Build package
npm run build

# Run tests
npm test

# Watch mode
npm run test:watch
```

---

## License

Distributed under the MIT License.
