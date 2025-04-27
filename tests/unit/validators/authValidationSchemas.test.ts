import { describe, it, expect } from 'vitest';

import {
  registerValidationSchema,
  loginValidationSchema,
} from '@validators/authValidationSchemas.ts';

describe('registerValidationSchema', () => {
  it('validates a correct payload', () => {
    const valid = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };
    expect(() => registerValidationSchema.parse(valid)).not.toThrow();
  });

  it('fails if required fields are missing', () => {
    expect(() => registerValidationSchema.parse({})).toThrow();
    expect(() =>
      registerValidationSchema.parse({ username: 'testuser', email: 'test@example.com' })
    ).toThrow();
    expect(() =>
      registerValidationSchema.parse({ username: 'testuser', password: 'password123' })
    ).toThrow();
    expect(() =>
      registerValidationSchema.parse({ email: 'test@example.com', password: 'password123' })
    ).toThrow();
  });

  it('fails if email is invalid', () => {
    expect(() =>
      registerValidationSchema.parse({
        username: 'testuser',
        email: 'notanemail',
        password: 'password123',
      })
    ).toThrow();
  });

  it('fails if password is too short', () => {
    expect(() =>
      registerValidationSchema.parse({
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      })
    ).toThrow();
  });
});

describe('loginValidationSchema', () => {
  it('validates a correct payload', () => {
    const valid = {
      email: 'test@example.com',
      password: 'password123',
    };
    expect(() => loginValidationSchema.parse(valid)).not.toThrow();
  });

  it('fails if required fields are missing', () => {
    expect(() => loginValidationSchema.parse({})).toThrow();
    expect(() =>
      loginValidationSchema.parse({ email: 'test@example.com' })
    ).toThrow();
    expect(() =>
      loginValidationSchema.parse({ password: 'password123' })
    ).toThrow();
  });

  it('fails if email is invalid', () => {
    expect(() =>
      loginValidationSchema.parse({
        email: 'notanemail',
        password: 'password123',
      })
    ).toThrow();
  });
});
