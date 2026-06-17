<br>

# **Projet Web (IPEFA Sup Seraing 2025/2026)**

<br>
<br>

<p align="center">
  <img src="https://img.shields.io/badge/Project-NestJS%20API-blue" alt="Project NestJS API" />
  <img src="https://img.shields.io/badge/Frontend-Pending-lightgrey" alt="Frontend Pending" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License MIT" />
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="Status In Development" />
</p>

<p align="center">
  <b>🇫🇷 Français</b> | <a href="README.md">🇬🇧 English</a>
</p>


## **Présentation**

Ce dépôt contient le projet réalisé dans le cadre du cours de web  
**Bachelier Informatique – Développement d’Applications**  
**IPEFA Sup Seraing – Année académique 2025/2026**

Il inclut :
- Une API backend complète en NestJS (backend-nest/)
- Un frontend moderne en Angular (frontend/)
- De la documentation, des schémas et des guides d’installation (docs/)

<br/>

## **Structure du dépôt**

```text
.
├── backend-nest/        → API NestJS (Auth, Sécurité, Migrations, Docker)
├── frontend-angular/    → Futur client web (Angular)
├── docs/                → Documentation détaillée, schémas, architecture
├── README.md            → Ce fichier (Français)
├── README.fr.md         → English version
└── LICENSE              → Licence du projet
```
<br/>

## **Stack Technique**

### **Backend (NestJS)**
- **Framework :** NestJS 10 (TypeScript 5)
- **Database :** PostgreSQL & TypeORM
- **Sécurité :** JWT Access Token, JWT Refresh Token, Refresh Token Rotation, Bcrypt
- **Documentation :** Swagger (OpenAPI)
- **DevOps :** Docker & Docker Compose

### **Frontend (Angular 21)**
Le frontend est développé avec Angular 21, utilisant :

- **Standalone Components**

- **Signals** pour la gestion d’état

- **Angular Router** avec lazy loading

- **Structure moderne :**

  - core/ → services, auth, interceptors, layouts
  - features/ → dashboard, recettes, membres
  - shared/ → composants UI réutilisables

- **Flux d’authentification :**

  - Login / Register
  - Access Token + Refresh Token (géré via interceptor)
  - Routes protégées via guards

- **Interface :**

  - Layout authentifié avec sidebar
  - Dashboard listant les recettes
  - CRUD des recettes (en cours)

<br/>

## **Lancement Rapide**

### Backend
Le backend s'exécute facilement via Docker. Depuis la racine du projet :

```bash
cd backend-nest
npm run docker:dev
```

La documentation interactive **Swagger** sera immédiatement disponible sur :
👉 `http://localhost:3000/docs` *(ou le port défini dans votre .env)*

### Frontend
Le frontend se lance via Angular CLI :

```bash
cd frontend
npm install
npm start
```
Serveur Angular :
👉 `http://localhost:4200`

<br/>

## **Base de données & Migrations**

Toujours dans le dossier `backend-nest/`, les migrations TypeORM assurent l'intégrité du schéma de la base de données :

- Générer une nouvelle migration :  
  ```bash
  npm run migration:generate -- src/migrations/NomDeLaMigration
  ```
- Appliquer les migrations en base de données :  
  ```bash
  npm run migration:run
  ```

<br/>

## **Sécurité & Authentification**

Le backend implémente un flux de sécurité robuste et moderne :
- **Access Token (JWT)** : Durée de vie courte (15 min), transmis via header HTTP (`Bearer`).
- **Refresh Token (JWT)** : Durée de vie longue (7 jours), haché et stocké en base de données pour permettre la révocation.
- **Refresh Token Rotation** : Chaque utilisation du Refresh Token génère un nouveau couple Access/Refresh, prévenant les attaques par rejeu.
- **Guards NestJS** : Protection fine des routes (`JwtAuthGuard`, `RefreshTokenGuard`).

Le frontend gère :
- **Le rafraîchissement automatique des tokens** via interceptor
- **La redirection** en cas de 401/403
- **Le logout + révocation du token**
<br/>

## Documentation

Toute la documentation du projet est organisée par domaine pour une meilleure lisibilité et une maintenance à long terme.

- **Architecture**    
  - [Architecture](docs/architecture/architecture.fr.md)

- **Installation & Configuration**   
  - [Guide d’installation](docs/setup/setup.fr.md)

- **Authentification & Sécurité**   
  - [Authentification](docs/auth/auth.fr.md)
  - [Jwt-flow](docs/auth/token-flow.fr.md)

- **Guards d’Authentification**
  - [Guards](docs/auth/guards.fr.md)

- **Décorateurs d’Authentification**
  - [Décorateurs](docs/auth/decorators.fr.md)

L’index global de la documentation est disponible ici :  
👉 [**Index de la documentation**](docs/index.fr.md)


<br/>


## **Licence**

Ce projet est distribué sous *[licence MIT](./LICENSE)*.  

<br/>

## **Auteur**

Projet réalisé par **Gregory Colard**  
*IPEFA Sup Seraing – Promotion 2025/2026*
