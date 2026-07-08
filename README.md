# Recently Viewed Products & Continue Shopping

Full-stack feature: recently viewed product tracking (guest + logged-in), guest-to-server history merge on login, and a "Continue Shopping" section (viewed but not purchased).

## Stack
- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT
- **Frontend:** React Native (Expo), TypeScript, Zustand, TanStack Query, AsyncStorage, Axios

## Project Structure
```
backend/   — REST API, MongoDB models, auth, business logic, tests
mobile/    — React Native app, screens, navigation, state
```

## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MongoDB Atlas URI + JWT secret
npm run seed            # inserts sample products
npm run dev              # starts on http://localhost:5000
```

Run tests:
```bash
npm test
```

### Mobile
```bash
cd mobile
npm install
npm start
```
Update `src/constants/config.ts` → `API_BASE_URL` to your backend's address (LAN IP for physical device, deployed URL for production).

## API Reference

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Get JWT |
| POST | `/api/recently-viewed` | ✓ | Record a product view |
| GET | `/api/recently-viewed` | ✓ | Get latest 20, sorted newest-first |
| DELETE | `/api/recently-viewed/:productId` | ✓ | Remove one entry |
| POST | `/api/recently-viewed/merge` | ✓ | Merge guest AsyncStorage history into server |
| GET | `/api/continue-shopping` | ✓ | Viewed products minus purchased |

## Core Design Decisions
- **Dedup + move-to-top:** single atomic `findOneAndUpdate` upsert on `{userId, productId}`, backed by a unique compound index — guarantees no duplicates even under concurrent requests.
- **Cap at 20:** enforced in the service layer after every write; oldest entries beyond the cap are deleted.
- **Merge conflict rule:** on login, whichever timestamp (guest vs server) is newer wins; AsyncStorage is cleared only after a successful merge response.
- **Continue Shopping:** recently-viewed list minus any product IDs present in the user's completed Orders.
- **Real-time multi-device sync:** Socket.io, one room per `userId` (`user:<id>`). Every write (add/remove/merge) emits the fresh 20-item list to that room, so all of a user's logged-in devices update within ~1 second — no manual refresh, no polling.

## Deployment
- **Backend:** deployed to Render (or Railway/Fly.io) — build with `npm run build`, start with `npm start`, env vars set in host dashboard. Socket.io runs on the same HTTP server/port as the REST API, no separate service needed.
- **Database:** MongoDB Atlas, IP access set to allow the hosting provider.
- **Mobile:** built via `eas build` for Android/iOS installable binaries, or run via Expo Go for development.

## Future Improvements
- Redis cache layer for high-traffic `GET /recently-viewed`
- Product recommendation engine based on view history
- Analytics on view-to-purchase conversion
- Rate limiting on write endpoints
- Refresh token rotation instead of long-lived JWTs
- Persist auth token across app restarts (currently in-memory only, requires re-login)
