# **Projet Web (IPEFA Sup Seraing 2025/2026)**

<p align="center">
  <img src="https://img.shields.io/badge/Project-NestJS%20API-blue" />
  <img src="https://img.shields.io/badge/Frontend-Pending-lightgrey" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" />
</p>

## **Présentation**

Ce dépôt contient le projet réalisé dans le cadre du cours de web  
**Bachelier Informatique – Développement d’Applications**  
**IPEFA Sup Seraing – Année académique 2025/2026**

Il est structuré en plusieurs modules, dont une API NestJS complète située dans `backend-nest/`.

---

## **Structure du dépôt**

```
.
├── backend-nest/        → API NestJS (auth, sécurité, migrations, Docker)
├── frontend/            → futur client web
├── docs/                → documentation, schémas, notes
├── README.md            → ce fichier
└── LICENSE              → licence du projet
```

---

## **Backend (NestJS)**

Le backend se trouve dans le dossier :

```
backend-nest/
```

Il inclut :

- Authentification JWT (Access + Refresh)
- Rotation sécurisée des refresh tokens
- Migrations TypeORM
- Docker pour le développement
- Swagger pour la documentation API

👉 **Voir le README complet dans `backend-nest/`**  
👉 Concepts clés :  
- **JWT Access Token**  
- **JWT Refresh Token**  
- **Refresh Token Rotation**  

---

## **Lancement rapide (API)**

Depuis la racine :

```
cd backend-nest
npm run docker:dev
```

Swagger sera disponible sur :

```
http://localhost:3002/docs
```

---

## **Migrations**

Toujours dans `backend-nest/` :

- Générer une migration :  
  ```
  npm run migration:generate -- src/migrations/<nom>
  ```

- Exécuter les migrations :  
  ```
  npm run migration:run
  ```

---

## **Licence**

Ce projet est distribué sous *[licence MIT](./LICENSE)*.  

---


## **Contact**

Projet réalisé par **Gregory Colard**  
IPEFA Sup Seraing – Promotion 2025/2026

---
