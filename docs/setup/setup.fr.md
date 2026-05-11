<br>

# Installation & Configuration

Ce guide détaille les étapes nécessaires pour configurer, lancer et gérer l'environnement de l'API NestJS.

## 1. Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :
*   **Node.js** (v20+ recommandé)
*   **npm** (Node Package Manager)
*   **Docker** & **Docker Compose**

<br>

## 2. Variables d'environnement

L'application utilise des variables d'environnement pour sa configuration.

1. Dupliquez le fichier `.env.example` situé à la racine du projet et renommez-le en `.env`.
2. Faite de même pour le fichier `.env.dev.example`.
3. Remplissez les valeurs sensibles (notamment les secrets JWT et les accès PostgreSQL).

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
JWT_SECRET=supersecretdelamortquitue
JWT_ACCESS_TOKEN_SECRET=supersecretaccess
JWT_REFRESH_TOKEN_SECRET=supersecretrefresh
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d
```

<br>

## 3. Lancement de l'Infrastructure (Docker)

Le projet inclut un fichier `docker-compose.dev.yml` pour démarrer rapidement la base de données PostgreSQL et l'API.

Depuis le répertoire `backend-nest`, exécutez :
```bash
npm run docker:dev
```
Pour arrêter les conteneurs :
```bash
npm run docker:stop
```

<br>

## 4. Migrations de la Base de Données

TypeORM est configuré avec `synchronize: false` pour garantir une gestion de base de données professionnelle (type production). Vous devez exécuter les migrations pour créer les tables.

*   **Générer une nouvelle migration** (après modification d'une entité) :
    ```bash
    npm run migration:generate -- src/migrations/NomDeLaMigration
    ```
*   **Appliquer les migrations en base de données** :
    ```bash
    npm run migration:run
    ```
*   **Annuler la dernière migration** :
    ```bash
    npm run migration:revert
    ```

<br>

Une fois lancée, accédez au **Swagger UI** sur : `http://localhost:3000/docs`

<br>
<p align="right">
  <a href="../index.fr.md">⬅ retour à l'index</a>
</p>