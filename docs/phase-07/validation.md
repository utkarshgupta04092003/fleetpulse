# Phase 07 - Validation Results

Every result below was measured against the running application in a browser,
not inferred from the code.

## Functional validation

### Realtime

| Check | Result |
|---|---|
| SSE endpoint works | 16 data frames over 9s, valid framing |
| Frontend receives events | Yes |
| No refresh required | Events `64 -> 80` over 7s with no reload |
| Rate matches generator | 16 events / 7s = 4 per 2s tick |
| 3+ numeric metrics change | speed `46.1 -> 43.3`, temp `66 -> 64.8`, fuel `56.3 -> 55` |
| LIVE indicator visible | Header badge |
| Last received timestamp | Header and dashboard, advancing |
| Status and event type visible | Status badge and event type per row |

### Periodic APIs

| Check | Result |
|---|---|
| Polling at configured interval | Repeating groups of summary + alerts + trends |
| Default interval 10s | Confirmed |
| Last updated timestamp visible | Dashboard and Analytics |
| Two or more aggregate endpoints | summary, alerts, trends |
| Periodic differs from raw telemetry | Aggregates with deltas vs single raw events |
| No duplicate timers | One group per interval, no stray calls |

### Authentication

| Check | Result |
|---|---|
| Login works | Lands on `/dashboard` |
| Invalid credentials show error | `Invalid email or password` |
| Network failure distinguished | `Cannot reach the FleetPulse API` |
| Protected routes redirect | `/dashboard` and `/vehicles` while logged out -> `/login` |
| Protected APIs reject unauthenticated | All six return 401 |
| Logout works | Redirect, cookie cleared, stream closed |
| 401 clears state and redirects | `Your session expired. Please sign in again.` |
| No protected data after expiry | Confirmed - dashboard content gone |
| Backend TTL expiry | 1-minute TTL: 200 at 0s, 200 at 30s, 401 at 70s |

### Pages

All six present with domain content: Login, Dashboard, Analytics, Vehicles,
Alerts, Settings.

### Interactions

| Check | Result |
|---|---|
| Search | Vehicles `100 -> 5` rows; Alerts `59 -> 54` |
| Filter | Status, severity and type filters change the visible set |
| Sort | Speed column: `59.1, 42.8, 37.1, 19.9, 10.8` descending |
| Pause/resume | Frozen at 116 events for 10s, then `116 -> 128` on resume |
| Pause keeps connection | No reconnect, no new stream request |
| Threshold control | `75 -> 63` changed alerts `24 -> 62`, critical `3 -> 24` |
| Threshold is server-side | Request carries `?tempThreshold=63` |
| Vehicle drawer | Opens with metrics, 3-series chart, alerts |
| Alert drawer | Opens with message, value, threshold, computed "exceeded by" |
| Animation | Page transitions, metric changes, LIVE pulse, event entry |

## UI validation

| Check | Result |
|---|---|
| Consistent theme | One palette, all pages |
| Readable contrast | Slate-on-navy, status colours distinct |
| Responsive - desktop 1440 | No overflow |
| Responsive - tablet 820 | No overflow, sidebar retained |
| Responsive - mobile 390 | No page overflow on any of the five pages |
| Tables on mobile | Scroll inside their card, page does not overflow |
| Loading states | Skeletons on first load |
| Empty states | "No vehicles match the current filters" and similar |
| Error states | "Showing last known data - Cannot reach the FleetPulse API" |
| No layout shift from live updates | Tabular figures on all changing numbers |

## Failure handling

Backend stopped while the dashboard was live:

| Check | Result |
|---|---|
| Connection state | `RECONNECTING` |
| Stale data warning | `Showing last known data - Cannot reach the FleetPulse API` |
| Last known values retained | Yes |
| Application crash | None |
| Spurious redirect | None - stays on the dashboard |

Backend restarted: the in-memory session is gone, the next poll returns 401,
and the app clears state and redirects to Login with the expiry message. After
signing in, the stream returns to `LIVE`.

## Technical validation

| Check | Result |
|---|---|
| Backend lint | Pass |
| Backend typecheck | Pass |
| Backend build | Pass |
| Frontend lint | Pass |
| Frontend typecheck | Pass |
| Frontend build | Pass, 8 routes |
| Console errors | None beyond the expected 401 when logged out |
| SSE listener leak | 4 connect/disconnect cycles, every frame delivered exactly once |
| Duplicate API calls | Session check deduped from 4 to 1 |

## Bugs found during validation, and fixed

1. **Dashboard render loop.** A zustand selector returned a new object on every
   call, breaking `useSyncExternalStore` snapshot caching. The page rendered
   "This page couldn't load" while lint, typecheck and build all passed. Fixed
   by selecting raw state and deriving with `useMemo`.

2. **Duplicate React keys.** The generator picked vehicles with replacement, so
   one vehicle could produce two events with the same id and timestamp in a
   single tick. Fixed by sampling distinct vehicles per tick, and by giving each
   received event a monotonic sequence number for use as a key.

3. **Horizontal overflow at 390px.** The dashboard event rows could not compress
   below 443px because the metrics group was `shrink-0`. Fixed by allowing the
   row to wrap.

4. **Four session requests instead of one.** The auth guard and the login page
   both checked the session, doubled again by React's development double-invoke.
   Fixed by sharing one in-flight promise.

5. **Favicon 404** on every page. Replaced with an app icon.

## Notes on what was not tested

- No automated test suite exists; the `test` stage in the pre-commit pipeline is
  wired but currently a no-op. All verification above was manual or
  browser-driven.
- Load and concurrency behaviour was not measured. The system is a
  single-process demo with in-memory state and was not built for that.
- Only Chromium was exercised.
