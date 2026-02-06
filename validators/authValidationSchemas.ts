import { z } from 'zod';

export const registerValidationSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const loginValidationSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerValidationSchema>;
export type LoginInput = z.infer<typeof loginValidationSchema>;
