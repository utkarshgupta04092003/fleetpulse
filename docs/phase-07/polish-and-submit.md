# Phase 07 - Polish and Submission

## Objective

Validate FleetPulse against the assignment before submission.

## Functional Validation

### Realtime
- [ ] SSE endpoint works
- [ ] frontend receives events
- [ ] no refresh required
- [ ] 3+ numeric metrics change
- [ ] LIVE indicator visible
- [ ] last received timestamp visible
- [ ] status/event type visible

### Periodic APIs
- [ ] polling occurs every configured interval
- [ ] default interval is 10 seconds
- [ ] last updated timestamp visible
- [ ] at least two aggregate/derived endpoints work
- [ ] periodic data differs from raw telemetry

### Authentication
- [ ] login works
- [ ] invalid credentials show error
- [ ] protected routes redirect
- [ ] protected APIs reject unauthenticated requests
- [ ] logout works
- [ ] 401 clears state and redirects
- [ ] realtime/polling stops safely after session expiry

### Pages
- [ ] Login
- [ ] Dashboard
- [ ] Analytics
- [ ] Vehicles
- [ ] Alerts
- [ ] Settings

Every page must have meaningful domain content.

### Interactions
- [ ] search
- [ ] filter
- [ ] sort
- [ ] pause/resume
- [ ] threshold control
- [ ] vehicle drawer
- [ ] alert drawer/modal
- [ ] visible animation/micro-interaction

## UI Validation

- [ ] consistent theme
- [ ] readable contrast
- [ ] responsive layout
- [ ] clear loading states
- [ ] clear empty states
- [ ] useful error states
- [ ] no layout shifts caused by live updates
- [ ] animations are subtle
- [ ] no unnecessary gradients/glows

## Technical Validation

Run:
- lint
- typecheck
- production build
- backend startup
- frontend startup

Verify no:
- unused imports
- obvious console errors
- unhandled promise rejections
- memory leaks from intervals/EventSource
- duplicated API calls
- stale state after logout

## Assessment Demo Flow

1. Open Login.
2. Sign in with demo credentials.
3. Show Dashboard.
4. Point out LIVE status and last received time.
5. Demonstrate changing telemetry.
6. Pause and resume live updates.
7. Open Analytics and wait for periodic refresh.
8. Show Last updated timestamp.
9. Open Vehicles and use search/filter/sort.
10. Open a vehicle drawer.
11. Open Alerts and inspect a derived alert.
12. Change threshold in Settings.
13. Log out.
14. Attempt to access a protected route and show redirect to Login.

## Documentation

README must include:
- project overview
- architecture
- stack
- setup
- environment variables
- demo credentials
- API endpoints
- realtime behavior
- polling behavior
- pages
- assignment requirement mapping

## Suggested Commits

```text
feat: initialize project
feat: implement backend telemetry generator
feat: add authentication
feat: implement SSE telemetry
feat: build dashboard
feat: add analytics and polling
feat: add vehicles and alerts
feat: add settings and interactions
style: polish dashboard UI
docs: add project documentation
```

## Final Rule

Do not submit until every assignment requirement can be demonstrated in the running application.
