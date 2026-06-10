<br>

# Authentication Guards Documentation
## Overview
Authentication guards enforce access control across the application.
They ensure that routes are protected by default (Secure by Default) and only explicitly opened when required.

This section covers:

- Secure by Default

- JwtAuthGuard

- RefreshTokenGuard

- Interaction with decorators

<br>

## JwtAuthGuard — Primary Access Token Guard
### Purpose
The JwtAuthGuard protects all routes by default.
It validates the access token and injects the authenticated user into req.user.

It also supports public routes through the Public decorator.

### Implementation
```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines whether the current request is allowed to proceed.
   * Public routes bypass authentication.
   */
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

### Behavior
- If the route is marked with `@Public()` → access is granted.
- Otherwise → JWT validation is performed.
- On success → `req.user = { sub, email, role }`.

<br>

## RefreshTokenGuard — Refresh Token Validation
### Purpose
The `RefreshTokenGuard` validates refresh tokens and enriches the request with the **raw refresh token**, enabling secure token rotation.

### Implementation
```ts
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {

  /**
   * Activates the guard, performs standard Passport validation, and enriches 
   * the user object with the raw refresh token for subsequent rotation logic.
   */
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

### Why enrich req.user?
- The refresh token payload **does not include** the raw token.
- The raw token is required to compare against the hashed version stored in the database.
- Centralizing this logic in the guard keeps controllers clean and consistent.

<br>

## Global Guard Registration (Secure by Default)
### In AppModule:

```ts
{
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
}
```

### Effect
- All routes are protected automatically.
- Only routes explicitly marked with Public are open.

<br>
<p align="right">
  <a href="../index.md">⬅ Back to index</a>
</p>
