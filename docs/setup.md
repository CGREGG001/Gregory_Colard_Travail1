<br>

# Setup & Installation

This guide provides step-by-step instructions to configure, run, and manage the NestJS API environment.

<br>

<p align="center">
  <b>🇬🇧 English</b> | <a href="setup.fr.md">🇫🇷 Français</a>
</p>


## 1. Prerequisites

Make sure you have the following installed on your machine:
*   **Node.js** (v20+ recommended)
*   **npm** (Node Package Manager)
*   **Docker** & **Docker Compose**

<br>

## 2. Environment Configuration

The application uses environment variables for configuration. 

1. Duplicate the `.env.example` file located at the root of the project and rename it to `.env.dev` (or simply `.env` depending on your setup).
2. Fill in the sensitive values (especially the JWT secrets and PostgreSQL credentials).

```env
# Example configuration
API_PORT=3000
APP_BASE_URL=api

# DATABASE
DB_TYPE=postgres
DB_HOST=localhost # Use 'db' if running the API inside Docker
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_DATABASE=BidaNest

# SECURITY
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_TOKEN_SECRET=your_access_secret_key
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret_key
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d
```

<br>

## 3. Running the Infrastructure (Docker)

The project includes a `docker-compose.dev.yml` file to quickly spin up the required PostgreSQL database and the API.

From the `backend-nest` directory, run:
```bash
npm run docker:dev
```
To stop the containers:
```bash
npm run docker:stop
```

<br>

## 4. Database Migrations

TypeORM is configured with `synchronize: false` to ensure production-like database management. You must run migrations to create the tables.

*   **Generate a new migration** (after changing an entity):
    ```bash
    npm run migration:generate -- src/migrations/MigrationName
    ```
*   **Apply migrations to the database**:
    ```bash
    npm run migration:run
    ```
*   **Revert the last migration**:
    ```bash
    npm run migration:revert
    ```

<br>

Once running, access the **Swagger UI** at: `http://localhost:3000/docs`

<br>
<p align="right">
  <a href="../README.md">⬅ Back to main README</a>
</p>