<br>

# Authentication Decorators Documentation
## Overview
Authentication decorators provide a clean and expressive way to access authentication metadata or extract user information from the request.

This section covers:
- CurrentUser
- Public
- Metadata and interaction with guards

## @CurrentUser() — Retrieve the Authenticated User
### Purpose
Extracts the authenticated user from req.user, populated by the guards.
Can return the full user object or a specific property.

### Implementation
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

### Examples
```ts
@CurrentUser() user
@CurrentUser('sub') memberId
@CurrentUser('role') role
```

### Typical usage
```ts
@Get('me')
getMe(@CurrentUser('sub') id: string) {
  return this.memberService.findByIdOrFail(id);
}
```

<br>

## @Public() — Declare a Public Route
### Purpose
Marks a route as publicly accessible.
Used by the JwtAuthGuard to bypass authentication.

### Implementation
```ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### Example
```ts
@Public()
@Post('signin')
signin() { ... }
```
<br>

## How Guards and Decorators Work Together

| Component | Purpose | Used by |
| --- | --- | --- |
| **[Public](ca://s?q=Explain_Public_Decorator)** | Marks a route as open | JwtAuthGuard |
| **[CurrentUser](ca://s?q=Explain_CurrentUser_Decorator)** | Extracts authenticated user | Controllers |
| **[JwtAuthGuard](ca://s?q=Explain_JwtAuthGuard)** | Protects routes by default | Global Guard |
| **[RefreshTokenGuard](ca://s?q=Explain_RefreshTokenGuard)** | Validates refresh tokens | ``/auth/refresh`` |

<br>
<p align="right">
  <a href="../index.md">⬅ Back to index</a>
</p>
