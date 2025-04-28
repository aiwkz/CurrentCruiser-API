import { describe, it, expect } from 'vitest';

import {
  createUserValidationSchema,
  updateUserValidationSchema,
  userIdParamValidationSchema,
} from '../../../validators/userValidationSchemas.ts';

describe('createUserValidationSchema', () => {
  it('validates a correct payload', () => {
    const valid = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };
    expect(() => createUserValidationSchema.parse(valid)).not.toThrow();
  });

  it('fails if required fields are missing', () => {
    expect(() => createUserValidationSchema.parse({})).toThrow();
    expect(() =>
      createUserValidationSchema.parse({
        username: 'testuser',
        email: 'test@example.com',
        // missing password and role
      })
    ).toThrow();
  });

  it('fails if email is invalid', () => {
    expect(() =>
      createUserValidationSchema.parse({
        username: 'testuser',
        email: 'notanemail',
        password: 'password123',
        role: 'user',
      })
    ).toThrow();
  });
});

describe('updateUserValidationSchema', () => {
  it('validates a partial update', () => {
    expect(() => updateUserValidationSchema.parse({ username: 'newname' })).not.toThrow();
    expect(() => updateUserValidationSchema.parse({ email: 'new@email.com' })).not.toThrow();
    expect(() => updateUserValidationSchema.parse({ password: 'newpass' })).not.toThrow();
    expect(() => updateUserValidationSchema.parse({ role: 'admin' })).not.toThrow();
  });

  it('fails if no update fields are provided', () => {
    expect(() => updateUserValidationSchema.parse({})).toThrow();
  });

  it('fails if a field is present but invalid', () => {
    expect(() => updateUserValidationSchema.parse({ username: '' })).toThrow();
    expect(() => updateUserValidationSchema.parse({ email: 'notanemail' })).toThrow();
  });
});

describe('userIdParamValidationSchema', () => {
  it('validates a correct id', () => {
    expect(() =>
      userIdParamValidationSchema.parse({ id: '507f1f77bcf86cd799439011' })
    ).not.toThrow();
  });

  it('fails for an invalid id', () => {
    expect(() => userIdParamValidationSchema.parse({ id: 'notanid' })).toThrow();
  });
});
