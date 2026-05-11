<br>

# Authentication & Security

This document explains the authentication flow, token management, and security strategies implemented in the API.

## 1. The JWT Flow

The API uses a dual-token system (JSON Web Tokens) to balance security and user experience:

*   **Access Token:** 
    *   **Lifespan:** Short (e.g., 15 minutes).
    *   **Usage:** Sent in the `Authorization: Bearer <token>` header for all protected API calls.
    *   **Validation:** Completely stateless. The server only checks the signature and expiration using the secret key.
*   **Refresh Token:**
    *   **Lifespan:** Long (e.g., 7 days).
    *   **Usage:** Used exclusively on the `/auth/refresh` endpoint to obtain a new pair of tokens when the Access Token expires.

<br>

## 2. Refresh Token Rotation

To mitigate the risks of a stolen Refresh Token, we implemented **Refresh Token Rotation**:

1. When a user logs in, a Refresh Token is generated. Its **Bcrypt hash** is stored in the database (`token` table).
2. When the user requests a refresh, the server compares the provided token with the stored hash.
3. If valid, the server generates a **brand new Access Token AND a brand new Refresh Token**.
4. The old Refresh Token is immediately invalidated (overwritten in the database by the new hash).

*Why is it secure?* If an attacker steals a Refresh Token and uses it, the legitimate user will be logged out the next time they try to refresh (since the token in the DB has changed), alerting them to the breach.

<br>

## 3. Strategies and Guards (NestJS / Passport)

The application uses specific NestJS Guards to protect routes:

*   **`JwtAuthGuard`:** Uses `JwtStrategy`. It intercepts the Access Token, verifies its signature, and injects the user's `sub` (ID) into the `Request` object.
*   **`RefreshTokenGuard`:** Uses `JwtRefreshStrategy`. It is applied **only** to the `/auth/refresh` route. It validates the Refresh Token's signature and passes both the payload and the raw token to the controller for database comparison.

To retrieve the currently authenticated user in controllers, we use the custom `@CurrentUser()` decorator.

<br>

## 4. Data Persistence & Hashing

Security is enforced at the database level:

*   **Passwords:** Plaintext passwords are never stored. They are hashed using `Bcrypt` with a dynamic salt before being saved in the `credential` table.
*   **ORM Protection:** The `password` and `deletedAt` columns are configured with `@Column({ select: false })`. This prevents TypeORM from accidentally exposing them when querying user data.
*   **Logout:** Calling `/auth/logout` simply deletes the token record from the database, instantly revoking the user's ability to refresh their session.

<br>
<p align="right">
  <a href="../index.md">⬅ Back to index</a>
</p>