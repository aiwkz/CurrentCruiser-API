import 'express';
import { AuthenticatedUser } from '@auth';

declare module 'express' {
  export interface Request {
    user?: AuthenticatedUser;
  }
}
