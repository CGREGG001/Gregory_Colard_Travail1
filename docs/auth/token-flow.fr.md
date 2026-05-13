<br>

# Token Flow — JWT Access & Refresh (avec Rotation)

Ce document décrit le fonctionnement complet du système d’authentification basé sur JWT Access Token, Refresh Token, et Refresh Token Rotation utilisé dans l’API NestJS.

Il couvre :

- Le signin
- L’accès aux routes protégées
- Le refresh token
- La rotation sécurisée
- La détection d’attaques
- Le logout
- Le stockage côté serveur et côté client

## 1. Concepts clés
### Access Token
- Durée courte (ex : 15 minutes)
- Contient l’identité de l’utilisateur
- Signé avec `JWT_ACCESS_TOKEN_SECRET`
- Jamais stocké côté serveur
- Utilisé dans `Authorization: Bearer <token>`

### Refresh Token
- Permet d’obtenir un nouveau couple de tokens
- Stocké côté client dans un cookie HTTPOnly
- Stocké côté serveur sous forme hachée
- Signé avec JWT_REFRESH_TOKEN_SECRET

### Refresh Token Rotation
À chaque appel `/auth/refresh` :

Un nouveau refresh token est généré

L’ancien est invalidé en DB

Permet de détecter les attaques (token volé)

<br>

## 2. Diagramme de séquence complet
Ce diagramme représente le flow complet : signin → accès → refresh → rotation → détection → logout.

![Token Flow](../diagrams/token-sequence-flow.png)

<br>

## 3. Détails du fonctionnement
### 3.1 Signin
1. Le client envoie email + mot de passe

2. Le serveur valide les credentials

3. Le serveur génère :
    - un Access Token (durée courte)
    - un Refresh Token (durée longue)

4. Le refresh token est :
    - envoyé au client (cookie HTTPOnly)
    - haché et stocké en DB

### 3.2 Accès à une route protégée
5. Le client envoie l’access token dans le header Authorization

6. Le serveur vérifie :
    - la signature
    - l’expiration

7. Si OK → accès accordé

### 3.3 Refresh Token Rotation
8. Le client envoie le refresh token (HTTPOnly)

9. Le serveur vérifie le hash en DB

10. Si valide :

11. génère un nouveau couple

12. remplace l’ancien refresh token en DB

13. Le client reçoit les nouveaux tokens

### 3.4 Détection d’un refresh token volé
14. Si un hacker réutilise un ancien refresh token :

15. Il n’existe plus en DB

16. Le serveur détecte une replay attack

17. Réponse : 401 Unauthorized

### 3.5 Logout
18. Le client appelle /auth/logout

19. Le serveur supprime le refresh token en DB

20. Le client est immédiatement déconnecté

<br>
<p align="right">
  <a href="../index.fr.md">⬅ Retour à l'index</a>
</p>