# Recently Viewed Products & Continue Shopping

Full-stack feature: recently viewed product tracking (guest + logged-in), guest-to-server history merge on login, real-time multi-device sync via Socket.io, and a "Continue Shopping" section (viewed but not purchased).

## Stack
- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Socket.io
- **Frontend:** React Native (Expo), TypeScript, Zustand, TanStack Query, AsyncStorage, Axios

## Project Structure
## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```
Run tests:
```bash
npm test
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```
Update `src/constants/config.ts` -> `API_BASE_URL` / `SOCKET_BASE_URL` to your backend's LAN IP.

## API Reference
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Get JWT |
| GET | /api/products | No | Browse catalog |
| POST | /api/recently-viewed | Yes | Record a product view |
| GET | /api/recently-viewed | Yes | Get latest 20, sorted newest-first |
| DELETE | /api/recently-viewed/:productId | Yes | Remove one entry |
| POST | /api/recently-viewed/merge | Yes | Merge guest AsyncStorage history into server |
| GET | /api/continue-shopping | Yes | Viewed products minus purchased |

## Core Design Decisions
- **Dedup + move-to-top:** single atomic findOneAndUpdate upsert on {userId, productId}, backed by a unique compound index - guarantees no duplicates even under concurrent requests.
- **Cap at 20:** enforced in the service layer after every write; oldest entries beyond the cap are deleted.
- **Merge conflict rule:** on login, whichever timestamp (guest vs server) is newer wins; AsyncStorage is cleared only after a successful merge response.
- **Continue Shopping:** recently-viewed list minus any product IDs present in the user's completed Orders.
- **Real-time multi-device sync:** Socket.io, one room per userId. Every write (add/remove/merge) emits the fresh 20-item list to that room, so all of a user's logged-in devices update within ~1 second - no manual refresh, no polling.

## Tests
24 automated tests covering auth, dedup, cap-at-20, merge logic, and purchased-product exclusion.
```bash
cd backend
npm test
```

## Deployment
- **Backend:** deployable to Render/Railway - build with npm run build, start with npm start.
- **Database:** MongoDB Atlas.
- **Mobile:** run via Expo Go for development, or build with EAS for installable binaries.

## Future Improvements
- Full cart/checkout system
- Redis cache layer for high-traffic reads
- Product recommendation engine
- Rate limiting on write endpoints
- Persist auth token across app restarts