# Phase 03 - Authentication

## Objective

Implement a simple but complete session flow.

The assignment explicitly requires login, protected routes, invalid/expired session handling, logout, and safe API state transitions.

## Demo Credentials

```text
Email: demo@fleetpulse.com
Password: password123
```

These credentials are for assessment/demo use only.

## Backend Endpoints

### POST /api/auth/login

Input:
```json
{
  "email": "demo@fleetpulse.com",
  "password": "password123"
}
```

Success returns session information.

Invalid credentials return 401.

### GET /api/auth/session

Returns the current authenticated session.

### POST /api/auth/logout

Invalidates the current session.

## Session Strategy

Use a simple server-managed demo session.

A session identifier is stored in an HttpOnly cookie.

Do not expose session secrets to JavaScript.

## Protected Routes

Frontend routes:
- /dashboard
- /analytics
- /vehicles
- /alerts
- /settings

Backend APIs must also validate authentication.

## Frontend Guard

Unauthenticated access:
```text
protected route
      |
      v
session check
   /       \\
valid     invalid
 |           |
render     /login
```

## 401 Handling

Every protected API client must handle 401 centrally.

On 401:
1. clear auth state
2. stop protected polling
3. close/disable realtime consumption
4. redirect to Login
5. show a useful session-expired message

Do not leave stale protected data visible as if it were current.

## Logout

Logout should:
- call backend logout
- clear frontend auth state
- clear protected transient state
- close realtime connection
- redirect to Login

## Security Notes

This is a dummy assessment authentication system, not production identity infrastructure.

Do not:
- store plaintext credentials beyond demo configuration
- log passwords
- expose session identifiers
- rely only on frontend route protection
