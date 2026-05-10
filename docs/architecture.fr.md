<br>

# Architecture du Projet

Ce document détaille les choix architecturaux et les design patterns utilisés pour garantir que cette API NestJS soit robuste, évolutive et "Corporate-grade".

<br>

<p align="center">
  <b>🇫🇷 Français</b> | <a href="architecture.md">🇬🇧 English</a>
</p>

<br>

## 1. Philosophie et Modèle (Separation of Concerns)
L'application suit une architecture modulaire stricte basée sur le principe de **Séparation des Préoccupations (SoC)**. Le code est divisé en deux grandes zones : le `core` et les `modules`.

### Le dossier `core/`
Il contient toute la logique transversale et agnostique au métier. Si le projet devait changer de finalité demain, le `core` pourrait être réutilisé tel quel.
* **ConfigManager (Singleton) :** Gère le chargement et la validation des variables d'environnement de manière centralisée.
* **Filtres Globaux (`HttpExceptionFilter`) :** Capture toutes les exceptions jetées par l'application pour empêcher les fuites de stack-trace et garantir un format d'erreur uniforme.
* **Intercepteurs (`ApiInterceptor`) :** Agit comme un middleware de sortie pour encapsuler toutes les réponses HTTP réussies dans un contrat d'interface strict (`ApiResponse`).

### Le dossier `modules/`
Contient la logique métier cloisonnée (Domain-Driven). 
Chaque module (ex: `member`, `security`) possède ses propres Entités, DTOs (Requêtes/Réponses), Services et Contrôleurs. Les dépendances circulaires sont évitées grâce à l'utilisation de fichiers "barils" (`index.ts`).

<br>

## 2. Standardisation des Communications (API Contract)
Pour faciliter le travail du Frontend (ou des clients de l'API), **absolument toutes les réponses** (succès ou erreurs) respectent la même interface TypeScript :

```json
{
  "result": true, // ou false en cas d'erreur
  "code": "api.success.common", // Code d'état lisible pour la traduction côté client
  "data": { ... } // La charge utile (ou le tableau d'erreurs de validation)
}
```
Ce formatage est entièrement automatisé par l'**ApiInterceptor** et le **HttpExceptionFilter**. Les contrôleurs ne s'occupent que de la logique pure.

<br>

## 3. Persistance et Base de Données (PostgreSQL + TypeORM)

### Identifiants Uniques (ULID)
Au lieu des auto-incréments classiques ou des UUID, nous utilisons des **ULID** (Universally Unique Lexicographically Sortable Identifier).
* **Avantage :** Ils sont uniques globalement (comme les UUID) mais triables temporellement. Cela empêche la fragmentation des index dans PostgreSQL et optimise les performances lors des insertions massives.
* **Implémentation :** Générés automatiquement via des hooks `@BeforeInsert()` dans les entités.

### Sécurité des Données Sensibles
Les données critiques (comme les mots de passe) sont protégées de deux manières :
1. **Au niveau DB :** `@Column({ select: false })` empêche TypeORM de charger le mot de passe par erreur lors d'un `find()`.
2. **Au niveau API :** L'utilisation de `class-transformer` (`instanceToPlain` dans l'intercepteur) garantit que les champs marqués d'un `@Exclude()` ne seront jamais envoyés au client.

<br>

## 4. Flux de Sécurité (Authentification & Autorisation)
*Voir la documentation détaillée dans [auth.md](./auth.md).*

Le système repose sur un mécanisme de **Refresh Token Rotation** :
1. Les accès sont validés de manière *stateless* via des **Access Tokens** courts (15 min) transmis en header HTTP (`Bearer`).
2. Les sessions sont maintenues via des **Refresh Tokens** longs (7 jours).
3. Le Refresh Token est **haché (Bcrypt)** avant d'être sauvegardé en DB. En cas de fuite de la base de données, les sessions ne peuvent pas être usurpées.

<br>

<p align="right">
  <a href="../README.fr.md">⬅ Retour au README principal</a>
</p>