export interface AuthenticatedUser {
  userId: string;
  role: string;
}

export interface JwtPayload {
  user: AuthenticatedUser;
  iat?: number;
  exp?: number;
}
