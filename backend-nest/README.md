<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10-red" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>


# **NestJS API - Auth, RBAC, Members & Recipes**
*Dans le cadre du cours de web | Bachelier Informatique en Developpemnt d'Application | IPEFA Sup Seraing 2025/2026*

## **Présentation générale**

Cette API NestJS fournit une architecture modulaire, sécurisée, documentée et scalable, intégrant :

- TypeORM + PostgreSQL
- JWT Access & Refresh Tokens
- Refresh Token Rotation
- RBAC (Role-Based Access Control)
- Swagger (OpenAPI 3)
- Docker pour le développement
- Migrations TypeORM
- Modules complets : Security, Member, Account, Recipe

Cette version v0.4.0 introduit notamment :

- Le module Recipe complet (CRUD, permissions, DTOs, Swagger)
- Le système RBAC avec @Roles() + RolesGuard global
- Le refactor complet du module Member
- L’ajout de MemberResponseDto et des mappers
- L’intégration des rôles dans le payload JW
- Une structure de projet finalisée et propre

L’objectif est de fournir une base solide, extensible, sécurisée et documentée pour construire une application backend moderne.

---

## **Sécurité & Authentification**

Le module Security inclut :

- JWT :
  - **JWT Access Token** (15 minutes)
  - **JWT Refresh Token** (7 jours)
  - **Refresh Token Rotation**  
- Stratégies :
  - **JwtStrategy** (access)
  - **JwtRefreshStrategy** (refresh)
- Guards :
  - **JwtAuthGuard**
  - **RefreshTokenGuard**
- RBAC :
  - **Décorateur @Roles(...)**
  - **Enum MemberRole**
  - **Protection automatique des routes sensibles**

- Swagger expose deux schémas Bearer :
  - **access-token**
  - **refresh-token**

---

## Modules principaux

### Security

- Authentification complète
- Gestion des tokens
- Credentials + Token Hashing
- RBAC global

### Member

- CRUD admin complet
- Soft delete
- Mise à jour du profil
- DTOs request/response
- Mappers intégrés
- Endpoints sécurisés par rôle

### Account

- Endpoint /account/me
- Mise à jour du profil utilisateur connecté

### Recipe

- CRUD complet
- Validation DTO
- Permissions (auteur/admin)
- Exceptions dédiées
- Swagger complet
- Relation Member → Recipe

---

## **Installation**

### 1. Cloner le projet

```
git clone <repo>
cd <repo>
```

### 2. Installer les dépendances

```
npm install
```

### 3. Configurer l’environnement

**Copier les fichiers d’exemple :**


```
cp .env.dev.example .env.dev
```

Puis remplir les valeurs :

```
# Variables for docker
# DATABASE
DB_TYPE=postgres
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=BidaNest

# API
API_PORT=3002
```
---

```
cp .env.example .env
```

Puis remplir les valeurs :

```
# API
API_PORT=3002
APP_BASE_URL=/api

# DATABASE
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=BidaNest

# BCRYPT SALT
BCRYPT_SALT_ROUNDS=12

# JWT SECRET
JWT_SECRET=xyogk3qaD9VZDytDkRpvaYebKav6KE6YDR3v8Z6116GXNF9W4GJ3V1yB7wnxv7Jp
JWT_ACCESS_TOKEN_SECRET=supersecretaccess
JWT_REFRESH_TOKEN_SECRET=supersecretrefresh
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d
```

---

## **Lancement avec Docker**

Le projet inclut un script :

```
npm run docker:dev
```

Ce script :

- lance PostgreSQL
- lance l’API NestJS en mode watch
- expose Swagger sur `http://localhost:3002/docs`

⚠️ **Les migrations doivent être exécutées manuellement.**

---

## **Migrations TypeORM**

### Exécuter les migrations

```
npm run migration:run
```

⚠️ À faire **après** le lancement Docker, car la DB doit être accessible.

---

Swagger :

http://localhost:3002/docs


### Générer une migration

```
npm run migration:generate -- src/migrations/<nom>
```


---

## **Endpoints principaux**

| Méthode | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | /auth/signup | Inscription | Public |
| POST | /auth/signin | Connexion (2 tokens) | Public |
| POST | /auth/refresh | Rotation tokens | Refresh Token |
| GET | /account/me | Profil utilisateur | Access Token |
| GET | /member | CRUD admin | Admin |
| GET | /recipe | CRUD recettes | Access Token |

---

## **Tester l’authentification dans Swagger**

1. Signin
2. Copier accessToken + refreshToken
3. Authorize
4. Tester les endpoints sécurisés

---

## **Structure du projet**

```
src/
├── core/
├── modules/
│   ├── security/
│   ├── member/
│   ├── account/
│   └── recipe/
├── migrations/
└── main.ts

```

---

## Scripts utiles

| Script | Description |
|--------|-------------|
| `docker:dev` | Lance l’API en mode watch + PostgreSQL |
| `migration:generate` | Génère une migration |
| `migration:run` | Exécute les migrations |

---

## Restons en contact

- Auteur - [Gregory Colard](https://github.com/CGREGG001)

---

## Licence

Ce projet est distribué sous [licence MIT](./LICENSE).
