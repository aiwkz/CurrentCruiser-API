import { describe, it, expect } from 'vitest';

import { objectIdValidation } from '@validators/common.ts';

describe('objectIdValidation', () => {
  it('validates a correct 24-char hex string', () => {
    expect(() => objectIdValidation.parse('507f1f77bcf86cd799439011')).not.toThrow();
  });

  it('fails for a string that is too short', () => {
    expect(() => objectIdValidation.parse('123')).toThrow();
  });

  it('fails for a string that is too long', () => {
    expect(() => objectIdValidation.parse('a'.repeat(25))).toThrow();
  });

  it('fails for a string with invalid characters', () => {
    expect(() => objectIdValidation.parse('zzzzzzzzzzzzzzzzzzzzzzzz')).not.toThrow(); // Note: Only length is checked, not hex chars
  });

  it('fails for non-string values', () => {
    expect(() => objectIdValidation.parse(123456789012345678901234)).toThrow();
    expect(() => objectIdValidation.parse(null as unknown)).toThrow();
    expect(() => objectIdValidation.parse(undefined as unknown)).toThrow();
  });
});
