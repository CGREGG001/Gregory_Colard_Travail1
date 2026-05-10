<br>

# Project Architecture

This document details the architectural choices and design patterns used to ensure this NestJS API remains robust, scalable, and "Corporate-grade".

<br>

<p align="center">
  <b>🇬🇧 English</b> | <a href="architecture.fr.md">🇫🇷 Français</a>
</p>

<br>

## 1. Philosophy and Model (Separation of Concerns)
The application follows a strict modular architecture based on the **Separation of Concerns (SoC)** principle. The codebase is divided into two main areas: `core` and `modules`.

### The `core/` Directory
Contains all cross-cutting, domain-agnostic logic. If the project were to pivot entirely, the `core` could be reused as-is.
* **ConfigManager (Singleton):** Centralizes the loading and validation of environment variables.
* **Global Filters (`HttpExceptionFilter`):** Catches all exceptions thrown by the application to prevent stack-trace leaks and guarantee a uniform error format.
* **Interceptors (`ApiInterceptor`):** Acts as an outbound middleware to wrap all successful HTTP responses into a strict interface contract (`ApiResponse`).

### The `modules/` Directory
Contains siloed business logic (Domain-Driven approach). 
Each module (e.g., `member`, `security`) has its own Entities, DTOs (Requests/Responses), Services, and Controllers. Circular dependencies are avoided through the use of barrel files (`index.ts`).

<br>

## 2. Communication Standardization (API Contract)
To simplify the work of the Frontend (or API clients), **absolutely all responses** (success or error) adhere to the same TypeScript interface:

```json
{
  "result": true, // or false in case of an error
  "code": "api.success.common", // Human-readable status code for client-side translation
  "data": { ... } // The payload (or array of validation errors)
}
```
This formatting is entirely automated by the **ApiInterceptor** and the **HttpExceptionFilter**. Controllers are left to handle pure business logic only.

<br>

## 3. Persistence and Database (PostgreSQL + TypeORM)

### Unique Identifiers (ULID)
Instead of classic auto-increments or UUIDs, we use **ULIDs** (Universally Unique Lexicographically Sortable Identifier).
* **Advantage:** They are globally unique (like UUIDs) but temporally sortable. This prevents index fragmentation in PostgreSQL and optimizes performance during massive inserts.
* **Implementation:** Automatically generated via `@BeforeInsert()` hooks in the entities.

### Sensitive Data Security
Critical data (like passwords) are protected in two ways:
1. **At the DB level:** `@Column({ select: false })` prevents TypeORM from accidentally loading the password during a generic `find()`.
2. **At the API level:** The use of `class-transformer` (`instanceToPlain` in the interceptor) ensures that fields marked with `@Exclude()` will never be sent to the client.

<br>

## 4. Security Flow (Authentication & Authorization)
*See detailed documentation in [auth.md](./auth.en.md).*

The system relies on a **Refresh Token Rotation** mechanism:
1. Access is validated statelessly via short-lived **Access Tokens** (15 min) transmitted in the HTTP header (`Bearer`).
2. Sessions are maintained via long-lived **Refresh Tokens** (7 days).
3. The Refresh Token is **hashed (Bcrypt)** before being stored in the DB. In the event of a database leak, sessions cannot be hijacked.

<br>

<p align="right">
  <a href="../README.md">⬅ Back to main README</a>
</p>
