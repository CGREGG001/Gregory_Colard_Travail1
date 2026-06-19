/**
 * Standard API response format matching the NestJS backend.
 */
export interface ApiResponse<T> {
  result: boolean;
  code: string;
  data: T;
  paramError?: boolean;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  role: string;
}

/**
 * The login response now only contains the user and the short-lived access token.
 * The refresh token is received and handled automatically via HttpOnly Cookie.
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}

/**
 * Payload required for the registration process.
 * Matches the backend SignupDto.
 */
export interface RegisterPayload {
  email: string;
  nickname: string;
  password: string;
  role: string;
}
