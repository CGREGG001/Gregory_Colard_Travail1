<br>

# Décorateurs d’Authentification

## Objectif
Les décorateurs permettent d’extraire ou d’annoter des informations liées à l’authentification.


## @CurrentUser() — Récupération de l’utilisateur courant
Rôle
- Récupère req.user injecté par les guards
- Peut retourner l’objet complet ou une propriété spécifique

Code
```ts
export const CurrentUser = createParamDecorator(
  <T = any>(data: keyof T | undefined, ctx: ExecutionContext): T | T[keyof T] | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as T;

    if (!user) {
      return null;
    }

    return data ? user?.[data] : user;
  },
);
```

Exemples
```ts
@CurrentUser() user
@CurrentUser('sub') memberId
@CurrentUser('role') role
```

Utilisation typique
```ts
@Get('me')
getMe(@CurrentUser('sub') id: string) {
  return this.memberService.findByIdOrFail(id);
}
```
<br>

## @Public() — Déclarer une route publique
### Rôle
- Marque une route comme accessible sans authentification
- Utilisé par le JwtAuthGuard via Reflector

Code
``` ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

Exemple
```ts
@Public()
@Post('signin')
signin() { ... }
```

<br>

## Interaction entre Guards et Décorateurs

| Élément | Rôle | Utilisé par |
| --- | --- | --- |
| **[Public](ca://s?q=Explain_Public_Decorator)** | Marque une route comme ouverte | JwtAuthGuard |
| **[CurrentUser](ca://s?q=Explain_CurrentUser_Decorator)** | Extrait l’utilisateur courant | Controllers |
| **[JwtAuthGuard](ca://s?q=Explain_JwtAuthGuard)** | Protège les routes par défaut | Global Guard |
| **[RefreshTokenGuard](ca://s?q=Explain_RefreshTokenGuard)** | Gère la rotation des tokens | Route ``/auth/refresh`` |

<br>
<p align="right">
  <a href="../index.fr.md">⬅ Retour à l'index</a>
</p>