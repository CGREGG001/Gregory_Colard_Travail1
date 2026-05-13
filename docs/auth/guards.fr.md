<br>

# Guards d’Authentification
## Objectif
Les guards gèrent l’accès aux routes en appliquant des règles d’authentification ou d’autorisation.
Dans notre architecture, ils assurent le Secure by Default : toutes les routes sont protégées sauf celles marquées comme routes publiques.


## JwtAuthGuard — Guard principal (Access Token)

### Rôle
- Valide le JWT d’accès via Passport (AuthGuard('jwt'))
- Hydrate req.user avec le payload validé
- Vérifie si la route est publique via le décorateur Public

### Code
```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

### Fonctionnement
- Si la route est décorée avec @Public() → accès immédiat.
- Sinon → validation du JWT.
- En cas de succès → req.user = { sub, email, role }.

<br>

## RefreshTokenGuard — Guard pour le refresh token
### Rôle
- Valide le JWT de refresh (AuthGuard('jwt-refresh'))
- Ajoute le token brut dans req.user.refreshToken
- Permet la rotation sécurisée des tokens

### Code
```ts
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    const can = super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (token) {
      request.user = {
        ...request.user,
        refreshToken: token,
      };
    }

    return can;
  }
}
```

### Pourquoi enrichir req.user ?
- Le payload du refresh token ne contient pas le token brut.
- Le service d’auth doit comparer le refresh token brut avec la version hashée en DB.
- Centraliser cette logique dans le guard est plus propre.

<br>

## Guard global (Secure by Default)
### Dans AppModule :

```ts
{
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
}
```

### Effet
- Toutes les routes deviennent protégées automatiquement.
- @Public() devient la seule manière d’ouvrir une route.

<br>
<p align="right">
  <a href="../index.fr.md">⬅ Retour à l'index</a>
</p>