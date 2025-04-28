import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import validateSchema from '../../../validators/validateSchema.ts';
import { createCarValidationSchema, carIdParamValidationSchema } from '../../../validators/carValidationSchemas.ts';

describe('validateSchema', () => {
  it('calls next() for valid body input and mutates req.body', () => {
    const req = {
      body: {
        name: 'Test',
        history: 'History',
        description: 'Desc',
        specifications: {
          motor: 'V6',
          horsepower: '300hp',
          mph0to60: '5.5s',
          topSpeed: '250km/h',
        },
        category_id: 'someid',
        available_in_market: true,
      }
    } as Request;
    const res = {} as Response;
    const next = vi.fn();

    validateSchema(createCarValidationSchema)(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({
      name: 'Test',
      history: 'History',
      description: 'Desc',
      specifications: {
        motor: 'V6',
        horsepower: '300hp',
        mph0to60: '5.5s',
        topSpeed: '250km/h',
      },
      category_id: 'someid',
      available_in_market: true,
    });
  });

  it('calls next(error) for invalid body input', () => {
    const req = { body: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();

    validateSchema(createCarValidationSchema)(req, res, next);
    expect(next).toHaveBeenCalled();
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('Validation failed');
  });

  it('calls next() for valid params input', () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn();

    validateSchema(carIdParamValidationSchema, 'params')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next(error) for invalid params input', () => {
    const req = { params: { id: 'notanid' } } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn();

    validateSchema(carIdParamValidationSchema, 'params')(req, res, next);
    expect(next).toHaveBeenCalled();
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('Validation failed');
  });
});
