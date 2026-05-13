<br>

# Index de la documentation
Bienvenue dans l’espace documentation du projet.
La documentation sont organisée par domaine afin de garantir une structure claire, évolutive et facile à naviguer.

## Architecture
Concepts fondamentaux, structure interne du backend, organisation des modules et principes de conception.

- [Architecture](./architecture/architecture.fr.md)


## Installation & Configuration
Configuration de l’environnement, utilisation de Docker, scripts, migrations et démarrage du projet.

- [Guide d’installation](./setup/setup.fr.md)


## Authentification & Sécurité
Fonctionnement du JWT, rotation des refresh tokens, guards, décorateurs personnalisés et bonnes pratiques de sécurité.

- [Authentification](./auth/auth.fr.md)
- [Jwt-flow](./auth/token-flow.md)


## Guards d’Authentification
Documentation détaillée sur les guards utilisés pour la sécurité :

- Secure by Default
- JwtAuthGuard
- RefreshTokenGuard
- Interaction avec les décorateurs
- [Guards](./auth/guards.fr.md)


## Décorateurs d’Authentification
Documentation sur les décorateurs personnalisés :

- @CurrentUser()
- @Public()
- Métadonnées et interaction avec les guards
- [Décorateurs](./auth/decorators.fr.md)

## À propos de cette structure
La documentation est organisée par domaine pour éviter l’encombrement et faciliter l’évolution du projet.
Des sections supplémentaires pourront être ajoutées ultérieurement :

- Tests automatisés
- CI/CD
- Conventions de code
- Référence des modules
- Sécurité avancée

<br>

<p align="right">
<a href="../README.fr.md">⬅ Retour au README principal</a>
</p>
