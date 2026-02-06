import { describe, it, expect } from 'vitest';

import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
  categoryIdParamValidationSchema,
} from '../../../validators/categoryValidationSchemas.ts';

describe('createCategoryValidationSchema', () => {
  it('validates a correct payload', () => {
    const valid = { name: 'SUV' };
    expect(() => createCategoryValidationSchema.parse(valid)).not.toThrow();
  });

  it('fails if name is missing', () => {
    expect(() => createCategoryValidationSchema.parse({})).toThrow();
  });

  it('fails if name is empty', () => {
    expect(() => createCategoryValidationSchema.parse({ name: '' })).toThrow();
  });
});

describe('updateCategoryValidationSchema', () => {
  it('validates a correct payload', () => {
    expect(() => updateCategoryValidationSchema.parse({ name: 'Updated' })).not.toThrow();
  });

  it('fails if name is missing', () => {
    expect(() => updateCategoryValidationSchema.parse({})).toThrow();
  });

  it('fails if name is empty', () => {
    expect(() => updateCategoryValidationSchema.parse({ name: '' })).toThrow();
  });
});

describe('categoryIdParamValidationSchema', () => {
  it('validates a correct id', () => {
    expect(() =>
      categoryIdParamValidationSchema.parse({ id: '507f1f77bcf86cd799439011' })
    ).not.toThrow();
  });

  it('fails for an invalid id', () => {
    expect(() => categoryIdParamValidationSchema.parse({ id: 'notanid' })).toThrow();
  });
});
