import { describe, it, expect } from 'vitest';

import {
  createCarValidationSchema,
  updateCarValidationSchema,
  carIdParamValidationSchema,
} from '../../../validators/carValidationSchemas.ts';

describe('createCarValidationSchema', () => {
  it('validates a correct payload', () => {
    const valid = {
      name: 'Test Car',
      history: 'Some history',
      description: 'A car',
      specifications: {
        motor: 'V6',
        horsepower: '300hp',
        mph0to60: '5.5s',
        topSpeed: '250km/h',
      },
      category_id: 'someid',
      available_in_market: true,
    };
    expect(() => createCarValidationSchema.parse(valid)).not.toThrow();
  });

  it('fails if required fields are missing', () => {
    expect(() => createCarValidationSchema.parse({})).toThrow();
  });

  it('fails if specifications are missing or incomplete', () => {
    const invalid = {
      name: 'Test Car',
      history: 'Some history',
      description: 'A car',
      category_id: 'someid',
      available_in_market: true,
    };
    expect(() => createCarValidationSchema.parse(invalid)).toThrow();

    const incompleteSpecs = {
      name: 'Test Car',
      history: 'Some history',
      description: 'A car',
      specifications: { motor: 'V6' }, // missing other fields
      category_id: 'someid',
      available_in_market: true,
    };
    expect(() => createCarValidationSchema.parse(incompleteSpecs)).toThrow();
  });
});

describe('updateCarValidationSchema', () => {
  it('validates a partial update', () => {
    expect(() => updateCarValidationSchema.parse({ name: 'Updated' })).not.toThrow();
    expect(() =>
      updateCarValidationSchema.parse({
        specifications: { motor: 'V8' },
      })
    ).not.toThrow();
  });

  it('fails if no update fields are provided', () => {
    expect(() => updateCarValidationSchema.parse({})).toThrow();
  });

  it('fails if a field is present but invalid', () => {
    expect(() => updateCarValidationSchema.parse({ name: '' })).toThrow();
    expect(() =>
      updateCarValidationSchema.parse({
        specifications: { motor: '' },
      })
    ).toThrow();
  });
});

describe('carIdParamValidationSchema', () => {
  it('validates a correct id', () => {
    expect(() =>
      carIdParamValidationSchema.parse({ id: '507f1f77bcf86cd799439011' })
    ).not.toThrow();
  });

  it('fails for an invalid id', () => {
    expect(() => carIdParamValidationSchema.parse({ id: 'notanid' })).toThrow();
  });
});
