<br>

# Project Documentation Index

Welcome to the documentation hub of the project.  
All technical guides are organized by domain for clarity and long-term maintainability.


## Architecture
Core concepts, project structure, design patterns, and backend philosophy.

- [Architecture](./architecture/architecture.md)


## Setup & Installation
Environment configuration, Docker workflow, migrations, and local development.

- [Setup Guide](./setup/setup.md)

## Authentication & Security
JWT flow, refresh token rotation, guards, decorators, and security best practices.

- [Authentication](./auth/auth.md)
- [Jwt-flow](./auth/token-flow.md)

## Authentication Guards
Detailed documentation about the guards used for security:

- Secure by Default

- JwtAuthGuard

- RefreshTokenGuard

- Interaction with decorators

- [Guards](./auth/guards.md)

## Authentication Decorators
Documentation about the custom decorators:

- @CurrentUser()

- @Public()

- Metadata and interaction with guards

- [Decorators](./auth/decorators.md)

## About This Structure
Documentation is grouped by domain to keep the project clean and scalable.  
Future sections may include:

- Testing  
- CI/CD  
- Coding Conventions  
- Module Reference  
- Security Hardening  

<br>

<p align="right">
  <a href="../README.md">⬅ Back to main README</a>
</p>
