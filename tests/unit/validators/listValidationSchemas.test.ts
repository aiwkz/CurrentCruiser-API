import { describe, it, expect } from 'vitest';

import {
  createListValidationSchema,
  updateListValidationSchema,
  listIdParamValidationSchema,
  userIdParamValidationSchema,
} from '../../../validators/listValidationSchemas.ts';

describe('createListValidationSchema', () => {
  it('validates a correct payload', () => {
    const valid = {
      user_id: '507f1f77bcf86cd799439011',
      title: 'My List',
      cars: ['carid1', 'carid2'],
    };
    expect(() => createListValidationSchema.parse(valid)).not.toThrow();
  });

  it('fails if required fields are missing', () => {
    expect(() => createListValidationSchema.parse({})).toThrow();
    expect(() =>
      createListValidationSchema.parse({ user_id: '507f1f77bcf86cd799439011' })
    ).toThrow();
    expect(() =>
      createListValidationSchema.parse({ title: 'My List' })
    ).toThrow();
  });

  it('fails if user_id is invalid', () => {
    expect(() =>
      createListValidationSchema.parse({
        user_id: 'notanid',
        title: 'My List',
        cars: [],
      })
    ).toThrow();
  });
});

describe('updateListValidationSchema', () => {
  it('validates a partial update', () => {
    expect(() =>
      updateListValidationSchema.parse({ title: 'Updated Title' })
    ).not.toThrow();
    expect(() =>
      updateListValidationSchema.parse({ cars: ['carid1'] })
    ).not.toThrow();
    expect(() =>
      updateListValidationSchema.parse({ user_id: '507f1f77bcf86cd799439011' })
    ).not.toThrow();
  });

  it('fails if no update fields are provided', () => {
    expect(() => updateListValidationSchema.parse({})).toThrow();
  });

  it('fails if user_id is invalid', () => {
    expect(() =>
      updateListValidationSchema.parse({ user_id: 'notanid' })
    ).toThrow();
  });
});

describe('listIdParamValidationSchema', () => {
  it('validates a correct id', () => {
    expect(() =>
      listIdParamValidationSchema.parse({ id: '507f1f77bcf86cd799439011' })
    ).not.toThrow();
  });

  it('fails for an invalid id', () => {
    expect(() => listIdParamValidationSchema.parse({ id: 'notanid' })).toThrow();
  });
});

describe('userIdParamValidationSchema', () => {
  it('validates a correct userId', () => {
    expect(() =>
      userIdParamValidationSchema.parse({ userId: '507f1f77bcf86cd799439011' })
    ).not.toThrow();
  });

  it('fails for an invalid userId', () => {
    expect(() => userIdParamValidationSchema.parse({ userId: 'notanid' })).toThrow();
  });
});
