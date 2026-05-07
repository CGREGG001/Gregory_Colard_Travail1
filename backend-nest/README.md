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


# **NestJS API (Security, Auth, Docker, Migrations)**
*Dans le cadre du cours de web | Bachelier Informatique en Developpemnt d'Application | IPEFA Sup Seraing 2025/2026*

## **Présentation générale**

Ce projet est une API NestJS modulaire, utilisant :

- TypeORM + PostgreSQL  
- JWT Access & Refresh Tokens  
- Refresh Token Rotation  
- Swagger pour la documentation  
- Docker pour l’environnement de développement  
- Scripts de migration TypeORM

L’objectif est de fournir une base solide, extensible, sécurisée et documentée pour construire une application backend moderne.

---

## **Sécurité & Authentification**

Le module Security implémente :

- **JWT Access Token** (15 minutes)
- **JWT Refresh Token** (7 jours)
- **Refresh Token Rotation**  
- Stratégies Passport dédiées :
  - **JwtStrategy** (access)
  - **JwtRefreshStrategy** (refresh)
- Guards :
  - **JwtAuthGuard**
  - **RefreshTokenGuard**

Swagger expose deux schémas Bearer distincts :

- `access-token`  
- `refresh-token`

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
JWT_SECRET=supersecretdelamortquitue
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

⚠️ **Les migrations ne sont pas exécutées automatiquement.**

---

## **Migrations TypeORM**

### Générer une migration

```
npm run migration:generate -- src/migrations/<nom>
```

### Exécuter les migrations

```
npm run migration:run
```

⚠️ À faire **après** le lancement Docker, car la DB doit être accessible.

---

Swagger :

```
http://localhost:3002/docs
```

---

## **Endpoints principaux**

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
|POST|/auth/signup | Inscription d'un membre | Public |
|POST|/auth/signin | Connexion (retourne 2 tokens) | Public |
|POST|/auth/refresh | Rotation des tokens | Refresh Token |
|GET|/account/status | Vérifie la session actuelle | Access Token |

---

## **Tester l’authentification dans Swagger**

1. Appeler `/auth/signin`  
2. Copier `accessToken` et `refreshToken`  
3. Cliquer sur **Authorize**  
   - `access-token` → access token  
   - `refresh-token` → refresh token  
4. Tester `/account/status`  
5. Tester `/auth/refresh`

---

## **Structure du projet**

```
src/
│
├── modules/
│   ├── security/
│   │   ├── controllers/
│   │   ├── strategies/
│   │   ├── guards/
│   │   ├── services/
│   │   └── security.module.ts
│   ├── member/
│   └── ...
│
├── core/
│   ├── config/
│   └── ...
├── main.ts
└── app.module.ts
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
