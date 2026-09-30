# Invictus Debug & Fix Log

This document captures the major issues, false starts, and fixes surfaced during the debugging sessions for the Google OAuth flow, Django auth setup, and the notes API load failures.

## Overview

The project mixes:
- Django session authentication for normal site login and admin/dashboard flow
- Django REST Framework JWT authentication for the notes API and frontend token usage
- Google OAuth via `django-allauth`
- A React frontend served separately from the Django backend

This hybrid setup caused several auth mismatches before the app could work reliably.

---

## 1) Google OAuth client / redirect mismatch

### Issue
The app was failing at Google sign-in with a redirect URI mismatch.

### Evidence
Google was rejecting the login request with:
- `redirect_uri_mismatch`
- `You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy`

### Root cause
The registered Google OAuth client and the callback route in the Django app did not match the active live public URL.

### Fixes applied
- Verified the correct callback URL:
  - `https://spearfish-oil-wrinkle.ngrok-free.dev/accounts/google/login/callback/`
- Confirmed the app was using the correct client ID in the backend env file
- Ensured the redirect URI in Google Cloud Console matched the live ngrok URL exactly, including trailing slash and domain

### Notes
The callback issue was very real, but by the time it was corrected, the app had already revealed a second major issue in the auth stack.

---

## 2) Stale environment variables / wrong runtime config

### Issue
The app appeared to still be using old values even after updating the env file.

### Root cause
The running app had not necessarily reloaded the updated env values, and there were signs that the active server config was stale.

### Fixes applied
- Verified the current env content in the backend
- Confirmed the valid Google client ID matched the one registered in the console
- Rechecked runtime values from Django to ensure the config being read by the app was the expected one

### Outcome
This was partially resolved by validating the actual loaded config and removing suspicion that the .env file itself was the primary problem.

---

## 3) Hybrid session/JWT auth mismatch

### Issue
The dashboard user was authenticated in Django session auth, but the frontend notes API was relying on JWTs.

### Symptoms
- Dashboard showed user as logged in
- Notes request returned `401`/`403`
- Browser had a CSRF cookie but no valid access token in local storage

### Root cause
The project mixed two auth systems without a proper bridge:
- same user logged in through Django session auth
- notes API expected `Authorization: Bearer <token>`

### Fixes applied
- Added session-aware auth handling for the API layer
- Enabled `SessionAuthentication` in DRF alongside `JWTAuthentication`
- Added a session-to-JWT exchange endpoint so a logged-in Django session could generate a valid JWT for the frontend
- Ensured the notes API still only served the current user's notes

### Key files touched
- `backend/Invictus/settings.py`
- `backend/api/views.py`
- `backend/api/urls.py`

---

## 4) Token exchange bug

### Issue
The token exchange endpoint was throwing a server error instead of returning access/refresh tokens.

### Root cause
A `NameError` caused by calling a missing symbol (`TokenRefreshView`) instead of generating JWTs directly.

### Fix
Replaced the broken logic with:
- `RefreshToken.for_user(user)`
- returning the access token and refresh token from the authenticated session user

### Outcome
The session exchange endpoint started returning `200 OK` and both token fields.

---

## 5) Notes API `401` / `403` failures

### Issue
The page loaded the dashboard, but the notes panel failed to load data.

### Symptoms
- `Error loading notes: Request failed with status code 403`
- Browser console showed failed API resource loads
- `localStorage` lacked JWT entries, only the cookie consent entry and CSRF cookie

### Root cause
The frontend was configured to call the wrong backend origin and lacked the proper auth tokens for the backend it was hitting.

### Fixes applied
- Confirmed the page was running on the ngrok domain
- Identified that the frontend `.env` was pointing at `http://127.0.0.1:8000`
- Updated the API base URL to the live backend origin
- Kept `withCredentials: true` so browser cookies/session context is included

### Key file
- `frontend/.env`
- `frontend/src/api.js`
- `frontend/src/components/notes.jsx`

---

## 6) CORS and CSRF configuration drift

### Issue
Cross-origin API calls and session-based requests were not always aligned with the live deployment URL.

### Root cause
The project had a mix of localhost and ngrok references, which caused Django to reject browser-originated calls or fail to accept the cookie/session handshake.

### Fixes applied
- Added/confirmed trusted origins for ngrok and localhost
- Kept CSRF and session cookie settings compatible with cross-origin dev usage
- Ensured backend CORS allowed the deployed frontend origin

### Key file
- `backend/Invictus/settings.py`

---

## 7) Wrong frontend backend origin

### Issue
The UI was trying to reach a local backend even while the user was on the ngrok-hosted site.

### Root cause
The frontend env file used a localhost URL, while the live app lived on a public ngrok domain.

### Fix
Set:
- `VITE_API_URL = https://spearfish-oil-wrinkle.ngrok-free.dev`

### Outcome
This aligned browser requests with the same backend that served the logged-in Django session.

---

## 8) Notes component behavior and error handling

### Issue
The notes UI was showing a generic error, but not clearly exposing the underlying auth problem.

### Fixes applied
- Kept the notes component fetching from the API as expected
- Improved the debugging path by confirming the real request URL and response status from the browser
- Traced the issue all the way back to backend auth mismatch and invalid origin selection

### Relevant file
- `frontend/src/components/notes.jsx`

---

## 9) Current validated state

### What is confirmed working
- Django session-authenticated exchange endpoint returns valid JWTs
- Session-authenticated notes request can succeed when the route is valid and the origin matches
- Redirect mismatch issue was identified as a separate Google OAuth configuration problem

### What was resolved
- stale env suspicion
- session/JWT mismatch
- broken token exchange logic
- frontend pointing to localhost instead of the live backend
- 401/403 API failures caused by auth/origin mismatch

---

## 10) Final takeaway

The project was suffering from at least three layers of issues at once:
1. Google OAuth redirect registration mismatch
2. Django session vs JWT auth mismatch
3. Frontend pointing at the wrong backend origin

Once those were addressed, the backend auth bridge was validated and the notes API load path was proven to work under a valid session-authenticated request.

This log reflects the actual debugging history, fixes, and root causes identified during the sessions with the assistant and other model runs.

## Additional fix summary captured after the original debug log

### Authentication bug: React login succeeded but the navbar remained signed out
- Root cause: JWT auth was being used in the React flow while Django server-rendered templates check `request.user.is_authenticated` from the session layer.
- Fix: created a session bridge that validates the JWT, loads the matching user, and calls `login(request, user)` to create the Django session cookie.
- Relevant files:
  - [backend/api/views.py](backend/api/views.py)
  - [backend/api/urls.py](backend/api/urls.py)
  - [frontend/src/components/form.jsx](frontend/src/components/form.jsx)

### CORS issue during local login
- Root cause: browser requests were split between `localhost` and `127.0.0.1`, which browsers treat as different origins.
- Fix: align app access to one origin and use the correct backend API URL consistently.

### Google OAuth 404 and redirect URI issues
- Root cause: missing `allauth` URLs and redirect mismatch between the live app URL and the Google OAuth client configuration.
- Fix: include `allauth.urls`, add the required Django settings, and use the public ngrok domain for the redirect.
- Relevant files:
  - [backend/Invictus/urls.py](backend/Invictus/urls.py)
  - [backend/Invictus/settings.py](backend/Invictus/settings.py)
  - [frontend/src/components/form.jsx](frontend/src/components/form.jsx)

### Registration form completeness
- Root cause: the modal submitted only username/password and omitted email/confirm password, which did not match the backend contract.
- Fix: add the missing fields and payload entries in the React form.

### Validation
- Browser verification confirmed the navbar changes from signed-out links to the authenticated user state after successful login.
- The Google OAuth path no longer fails with a route-missing 404 once `allauth.urls` is included.
