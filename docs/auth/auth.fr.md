<br>

# Sécurité & Authentification

Ce document explique le flux d'authentification, la gestion des jetons et les stratégies de sécurité implémentées dans l'API.

## 1. Le Flux JWT (JSON Web Token)

L'API utilise un système à double jeton pour équilibrer sécurité et expérience utilisateur :

*   **Access Token (Jeton d'accès) :** 
    *   **Durée de vie :** Courte (ex: 15 minutes).
    *   **Utilisation :** Envoyé dans le header `Authorization: Bearer <token>` pour tous les appels API protégés.
    *   **Validation :** Totalement *stateless*. Le serveur vérifie uniquement la signature et l'expiration.
*   **Refresh Token (Jeton de rafraîchissement) :**
    *   **Durée de vie :** Longue (ex: 7 jours).
    *   **Utilisation :** Utilisé exclusivement sur la route `/auth/refresh` pour obtenir une nouvelle paire de jetons lorsque l'Access Token expire.

<br>

## 2. Rotation des Refresh Tokens (Refresh Token Rotation)

Pour atténuer les risques liés au vol d'un Refresh Token, nous avons implémenté la **Rotation de Jeton** :

1. Lors de la connexion, un Refresh Token est généré. Son **empreinte (hash Bcrypt)** est stockée en base de données (table `token`).
2. Lors d'une demande de rafraîchissement, le serveur compare le jeton fourni avec le hash stocké.
3. S'il est valide, le serveur génère un **nouvel Access Token ET un nouveau Refresh Token**.
4. L'ancien Refresh Token est immédiatement invalidé (écrasé en base de données par le nouveau hash).

*Pourquoi est-ce sécurisé ?* Si un attaquant vole et utilise un Refresh Token, l'utilisateur légitime sera déconnecté lors de sa prochaine tentative (puisque le jeton en DB aura changé), le forçant à se reconnecter et invalidant la session du pirate.

<br>

## 3. Stratégies et Guards (NestJS / Passport)

L'application utilise des Guards NestJS spécifiques pour protéger les routes :

*   **`JwtAuthGuard` :** Utilise la `JwtStrategy`. Il intercepte l'Access Token, vérifie sa signature et injecte le `sub` (ID) de l'utilisateur dans l'objet `Request`.
*   **`RefreshTokenGuard` :** Utilise la `JwtRefreshStrategy`. Il est appliqué **uniquement** sur la route `/auth/refresh`. Il valide la signature du Refresh Token et transmet le payload ainsi que le jeton brut au contrôleur pour comparaison en base de données.

Pour récupérer l'utilisateur actuellement authentifié dans les contrôleurs, nous utilisons le décorateur personnalisé `@CurrentUser()`.

<br>

## 4. Persistance et Hachage

La sécurité est appliquée jusqu'au niveau de la base de données :

*   **Mots de passe :** Les mots de passe en clair ne sont jamais stockés. Ils sont hachés via `Bcrypt` (avec un sel dynamique) avant d'être sauvegardés dans la table `credential`.
*   **Protection ORM :** Les colonnes `password` et `deletedAt` sont configurées avec `@Column({ select: false })`. Cela empêche TypeORM de les exposer accidentellement lors de requêtes génériques.
*   **Déconnexion (Logout) :** L'appel à `/auth/logout` supprime simplement l'enregistrement du jeton en base de données, révoquant instantanément la capacité de l'utilisateur à rafraîchir sa session.


<br>
<p align="right">
  <a href="../index.fr.md">⬅ Retour à l'index</a>
</p>