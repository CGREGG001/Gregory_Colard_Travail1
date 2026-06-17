<br>

# **Web Project (IPEFA Sup Seraing 2025/2026)**

<br>
<br>

<p align="center">
  <img src="https://img.shields.io/badge/Project-NestJS%20API-blue" alt="Project NestJS API" />
  <img src="https://img.shields.io/badge/Frontend-Pending-lightgrey" alt="Frontend Pending" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License MIT" />
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="Status In Development" />
</p>

<p align="center">
  <b>🇬🇧 English</b> | <a href="README.fr.md">🇫🇷 Français</a>
</p>



## **Overview**

This repository contains the full-stack the web project developed for the course:  
**Bachelor in Computer Science – Application Development**  
**IPEFA Sup Seraing – Academic Year 2025/2026**

It includes:

- A complete NestJS backend API (backend-nest/)
- A modern Angular frontend (frontend/)
- Documentation, architecture, and setup guides (docs/)

<br/>

## **Repository Structure**

```text
.
├── backend-nest/        → NestJS API (Auth, Security, Migrations, Docker)
├── frontend/            → Future web client (Angular)
├── docs/                → Detailed documentation, schemas, architecture
├── README.fr.md         → French version
├── README.md            → This file (English)
└── LICENSE              → Project license
```

<br/>

## **Tech Stack**

### **Backend (NestJS)**
- **Framework:** NestJS 10 (TypeScript 5)
- **Database:** PostgreSQL & TypeORM
- **Security:** JWT Access Token, JWT Refresh Token, Refresh Token Rotation, Bcrypt
- **Documentation:** Swagger (OpenAPI)
- **DevOps:** Docker & Docker Compose

### **Frontend (Angular 21)**
The frontend is built with **Angular 21** using:

- **Standalone Components**

- **Signals for state management**

- **Angular Router with lazy loading**

- **Modern folder structure:**
  - core/ → services, auth, interceptors, layouts
  - features/ → dashboard, recipes, members
  - shared/ → reusable UI components

- **Auth flow:**
  - Login / Register
  - Access Token + Refresh Token (handled via interceptor)
  - Protected routes with guards

- **UI:**
  - Authenticated layout with sidebar
  - Dashboard listing recipes
  - CRUD for recipes (in progress)

<br/>

## **Quick Start**
### Backend

The backend easily runs via Docker. From the project root:

```bash
cd backend-nest
npm run docker:dev
```

The interactive **Swagger** documentation will be immediately available at:
👉 `http://localhost:3000/docs` *(or the port defined in your .env)*

### Frontend

The frontend easily runs via ng serve. From the project root:

```bash
cd frontend
npm install
npm start
```

Angular dev server:
👉 `http://localhost:4200`

<br/>

## **Database & Migrations**

Inside the `backend-nest/` directory, TypeORM migrations ensure database schema integrity:

- Generate a new migration:  
  ```bash
  npm run migration:generate -- src/migrations/MigrationName
  ```
- Run pending migrations:  
  ```bash
  npm run migration:run
  ```

<br/>

## **Security & Authentication**

The backend implements a robust and modern security flow:
- **Access Token (JWT):** Short-lived (15 min), transmitted via HTTP Header (`Bearer`).
- **Refresh Token (JWT):** Long-lived (7 days), hashed and stored in the DB to allow revocation.
- **Refresh Token Rotation:** Every use of a Refresh Token generates a new Access/Refresh pair, preventing replay attacks.
- **NestJS Guards:** Fine-grained route protection (`JwtAuthGuard`, `RefreshTokenGuard`).

The frontend handles:

- **Automatic token refresh** via interceptor
- **Redirection** on 401/403
- **Logout + token revocation**

<br/>

## Documentation

All project documentation is organized by domain for clarity and long-term maintainability.

- **Architecture**  
  - [Architecture](docs/architecture/architecture.md)  

- **Setup & Installation**  
  - [Setup Guide](docs/setup/setup.md)  

- **Authentication & Security**  
  - [Authentication](docs/auth/auth.md)
  - [Jwt-flow](docs/auth/token-flow.md)

- **Authentification Guards**
  - [Guards](docs/auth/guards.md)

- **Authentification Decorators**
  - [Décorators](docs/auth/decorators.md)

A global documentation index is available here:  
👉 [**Documentation Index**](docs/index.md)


<br/>

## **License**

This project is distributed under the *[MIT License](./LICENSE)*.  

<br/>

## **Author**

Project developed by **Gregory Colard**  
*IPEFA Sup Seraing – Class of 2025/2026*
