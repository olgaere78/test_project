# MediaMars QA Recruitment Playwright Tests

Playwright + TypeScript test project for `https://qa-a.recruitment.mediamarslab.com`.

## Covered scope

- API auth contract: required `X-Access-Key`, register, login, bearer profile access.
- Internal analytics API: `GET /api/analytics/events` with `X-Access-Key` and HTTP Basic Auth.
- UI E2E: registration, todo creation/completion/deletion, profile consent/password validation.
- Admin UI: login and user search with issued admin credentials.

The UI app does not add `X-Access-Key` to browser `/api/**` requests, while the backend requires it. UI tests therefore install a Playwright route that adds the header to API requests, matching the documented contract.

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
```

Fill `.env` with values from `/vacancy-application.html`:

```bash
BASE_URL=https://qa-a.recruitment.mediamarslab.com
ACCESS_KEY=...
ADMIN_LOGIN=...
ADMIN_PASSWORD=...
```

## Run

```bash
npm test
npm run test:api
npm run test:ui
npm run report
```

## Structure

```text
src/
  api/          API helper for auth, todos, profile, analytics
  config/       environment loading
  fixtures/     Playwright fixtures and X-Access-Key route injection
  pages/        UI page objects
  utils/        test data factories
tests/
  api/
  ui/
```
