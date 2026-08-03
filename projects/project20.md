# Pollachi Express — Real-Time Food Ordering Platform

A complete real-time food ordering system for **Pollachi, Tamil Nadu**, built around three roles — **Customer**, **Admin** and **Delivery rider** — with live order tracking pushed over WebSockets and background push notifications.

| Layer | Technology | Role |
|---|---|---|
| Mobile app | React Native 0.81 (Expo SDK 54) | iOS + Android single codebase |
| State management | Redux Toolkit + React Redux | Global state, async thunks, persisted cart |
| Navigation | React Navigation v7 (native-stack + bottom-tabs) | Role-based flows: customer / admin / delivery |
| API server | Node.js + Express 4 (ESM) | REST endpoints, auth, middleware |
| Real-time | Socket.IO 4 | Bi-directional live order events & driver dispatch |
| Database | MongoDB + Mongoose 8 | Document schemas, compound indexes, field-level encryption |
| Auth | JWT access + rotating opaque refresh tokens | Stateless auth with token rotation |
| Push | Firebase Cloud Messaging (`firebase-admin`) | Foreground/background order + marketing alerts |
| Validation | Zod | Schema-based request validation (orders) |
| Storage | `expo-secure-store` | Tokens, auth session & cart persistence |
| Deployment | Vercel (backend) + EAS Build (mobile) | Serverless API + native builds |

---

## Table of Contents

1. [Monorepo Layout](#monorepo-layout)
2. [System Architecture](#system-architecture)
3. [End-to-End Order Flow](#end-to-end-order-flow)
4. [Backend Deep Dive](#backend-deep-dive)
5. [Authentication & Security](#authentication--security)
6. [Database Schemas](#database-schemas)
7. [Real-Time (Socket.IO)](#real-time-socketio)
8. [Pricing, Discounts & Fees Engine](#pricing-discounts--fees-engine)
9. [Push Notifications](#push-notifications)
10. [Mobile Deep Dive](#mobile-deep-dive)
11. [REST API Reference](#rest-api-reference)
12. [Environment Variables](#environment-variables)
13. [Getting Started](#getting-started)
14. [Deployment Notes](#deployment-notes)

---

## Monorepo Layout

```
POLLACHI_EXPRESS/
├── backend/                      # Node.js + Express API + Socket.IO
│   ├── server.js                 # ESM entry — Express app, socket init, routes
│   ├── vercel.json               # Serverless deploy config
│   ├── create-admin.js           # Seeds admin@pollachi.com / adminpassword123
│   ├── .env.example
│   └── src/
│       ├── config/               # db.js, firebase.js
│       ├── middleware/           # auth.middleware.js, validate.js, error.handler.js
│       ├── modules/
│       │   ├── auth/             # register/login/refresh, addresses, favorites, users, drivers
│       │   ├── products/         # catalogue + stock + reviews mounted here
│       │   ├── orders/           # ordering engine, pricing, status transitions
│       │   ├── settings/         # singleton delivery/platform fees + broadcast tools
│       │   ├── discounts/        # campaign-based % discounts
│       │   ├── reviews/          # product ratings (unique per user × product)
│       │   └── notifications/    # FCM service + inactive-user re-engagement task
│       ├── socket/               # socket.server.js, order.events.js
│       └── utils/                # logger, helpers, crypto (RSA-OAEP field encryption)
├── mobile/                       # React Native (Expo SDK 54)
│   ├── App.js                    # splash, notifications, state rehydration
│   ├── app.json / eas.json       # Expo & EAS build profiles
│   └── src/
│       ├── screens/              # 20+ screens — customer, admin, delivery
│       ├── navigation/           # AppNavigator (role switch), Admin/Delivery navigators
│       ├── store/                # Redux store + 5 slices + persistence middleware
│       ├── services/             # api.js (axios), socket.js (socket.io-client)
│       ├── hooks/                # useSocket, useOrderTracking, useLocation
│       ├── components/           # LiveTracker, StatusBadge, OrderCard, ProductItem...
│       ├── theme/                # Pollachi-green design tokens
│       └── utils/                # discountHelpers (mirrors backend logic)
├── docx_content.txt              # Original spec/guide (extracted)
└── realtime_order_workflow_guide.docx
```

---

## Features

**Customer (`mobile`)**
- Register / login / logout, saved addresses, product favorites
- Browse menu by category with search, food detail, spice/veg metadata & ratings
- Cart (local Redux) with discounted pricing shown live, persisted in SecureStore
- Place orders → live order tracking screen with status timeline + ETA
- Push notifications for every status change (even when backgrounded)

**Admin (mobile)**
- Live orders dashboard (Socket-driven, no refresh), status progression flow
- Menu management (create/edit products with image picker), reviews/ratings views
- Order history with filters + a **Map/heatmap** screen plotting delivery addresses
- Team management: list users, promote to admin, create delivery drivers
- Discount campaigns manager + global settings (fees, coupon) + broadcast FCM

**Delivery (mobile)**
- Dispatch screen listing assigned `preparing`/`ready` orders
- One-tap status advance, call customer, open Google Maps navigation
- Live sync via sockets + 15s polling fallback

---

## Architecture

```
                    ┌─────────────────────────────┐
                    │     React Native (Expo)     │
                    │  Customer / Admin / Rider   │
                    └──────────┬──────┬───────────┘
                       REST    │      │  Socket.IO
                   (axios +    │      │ (socket.io-client)
                    jwt bearer)│      │
                    ┌──────────▼──────▼──────────────────────────────────┐
                    │                 Express API + Socket.IO            │
                    │  auth · products · orders · settings · discounts   │
                    │              reviews · notifications               │
                    └───────────┬──────────────────────┬─────────────────┘
                          Mongoose ODM          Firebase Admin SDK
                                │                       │
                    ┌───────────▼─────────┐  ┌──────────▼─────────────┐
                    │  MongoDB Atlas      │  │  FCM                 │
                    │  (encrypted fields) │  │  → device tokens     │
                    └─────────────────────┘  └───────────────────────┘
```

Every client action flows through the same pipeline:

```
Socket/HTTP request
  → Express middleware (CORS, JSON)
  → requireAuth(roles)  ──────────────►  JWT verify + role check
  → validate(schema)    ──────────────►  Zod `safeParse` (orders)
  → controller → service
  → Mongoose (MongoDB) ───────────────►  pre/post save hooks (RSA encrypt/decrypt)
  → Socket.IO emit     ───────────────►  room-based event push
  → FCM delivery       ───────────────►  push notification
```

---

## End-to-End Order Flow

```
1  Customer logs in        POST /api/auth/login → access + refresh tokens → SecureStore
2  Browse + cart           GET /api/products → Redux cache; cart stays local
3  Place order             POST /api/orders → stock/discount/fee engine → order "pending"
4  Admin live alert        io.to("admin:dashboard") → "new_order" → dashboard shows instantly
5  Admin confirms          PUT /api/orders/:id/status {status:"confirmed"}
6  Customer live update    io.to("order:{id}") → "order_update" → Redux → LiveTracker UI
7  Push notification       firebase-admin → user's FCM device token
8  Admin assigns rider     PUT /api/orders/:id/assign → status "preparing", global "driver_assigned"
9  Rider delivers          status → "delivered" → final order_update + FCM → history
```

Status lifecycle: `pending → confirmed → preparing → ready → delivered` (or `cancelled`).

---

## Backend Deep Dive

### server.js (entry)
- Loads `dotenv`, creates Express + `http.Server`, enables `cors` from `CLIENT_ORIGINS`.
- `initSocket(httpServer)` and exposes `io` to controllers via `app.set("io", io)`.
- Mounts routers at `/api/auth`, `/api/products`, `/api/orders`, `/api/settings`, `/api/discounts`.
- 404 JSON handler + global `errorHandler` last.
- **Deployment-aware start:** listens on `PORT||5000` only when not in production and when `VERCEL` is not set; exports `app` for serverless.

### Auth module (`src/modules/auth`)
Arguably the heart of the role system.

| Endpoint | Access | Behavior |
|---|---|---|
| `POST /api/auth/register` | public | 409 on duplicate email; bcrypt(12); creates `customer` |
| `POST /api/auth/login` | public | checks `isActive`, sets `lastActive`, issues tokens |
| `POST /api/auth/refresh` | public | rotates the refresh token, defeats replay |
| `POST /api/auth/logout` | user | nulls `refreshToken` |
| `PATCH /api/auth/fcm-token` | user | stores the device push token |
| `POST /api/auth/address` / `PUT /:index` / `DELETE /:id` | user | saved address book |
| `POST /api/auth/favorites/:productId` | user | toggles a product in `favorites` |
| `GET /api/auth/users` | admin | all users minus secrets |
| `POST /api/auth/drivers` | admin | creates a `delivery`-role account |
| `PATCH /api/auth/users/:id/role` | admin | whitelist `customer|admin|delivery` |

Token design (in `auth.service.js`):
- **Access token** — JWT signed with `JWT_SECRET`, 15 min, payload `{userId, email, role}`.
- **Refresh token** — opaque 40-byte random hex; only its **SHA-256 hash** is stored; a new one is minted **every refresh** (rotation) — the old one is concurrently invalid.

### Middleware
- `requireAuth(roles=[])` — optional `Authorization: Bearer <jwt>`, role whitelist → 401/403.
- `validate(schema)` — Zod `safeParse` on body; on failure 400 with `flatten().fieldErrors`; replaces `req.body` with parsed data.
- `error.handler` — `AppError`/status-aware, strips stack in production.
- `utils/logger` — level-gated, emoji-prefixed console logger.
- `utils/crypto` — **RSA-OAEP (SHA-256)** `encrypt`/`decrypt` used by Mongoose hooks. `scripts/generate-keys.js` writes `RSA_PUBLIC_KEY`/`RSA_PRIVATE_KEY` into `.env`.

### Orders engine (`src/modules/orders`)
- **`placeOrder`** — stock-validates, computes price, applies best discount and coupon, adds delivery & platform fees, logs `statusHistory`, and emits `new_order` to admins.
- **`updateOrderStatus`** — driver re-assignment protection: a `delivery` user may only update an order they are assigned to.
- **`assignDriver`** — assigns rider, forces status `preparing`, **globally** broadcasts `driver_assigned`.
- **`cancelOrder`** — marks cancelled, restores stock per item, emits + pushes.
- **`deleteOrderPermanently`** — hard delete used by admin destroy.
- **`getAllOrders`** — paginated, filtered by status/date range/user.
- **`getDriverOrders`** — deliveries in `preparing`/`ready` for the current rider.

### Products
- Public: list (with `page`/`limit`/`category`/`search`) + detail.
- Admin: create/update/soft-delete (`isAvailable=false`).
- Reviews are mounted on the product router (`GET /api/products/ratings/all`, `POST /:id/review`, `GET /:id/reviews`) with a unique `(userId, productId)` index.

### Reviews
- Ratings 1–5, one per user per product.

### Notifications & marketing
- `notifications.service.js` sends single-token (`sendOrderNotification`) and multicast (`sendBroadcastNotification`) FCM pushes.
- `inactive_users.task.js` — a cron-style re-engagement sweep (`We Miss You!`) targeting users inactive 7+ days; admin triggers it via `POST /api/settings/notify-inactive`.

---

## Authentication & Security

```
SecureStore
 ├─ accessToken     (JWT, 15 min)
 ├─ refreshToken    (opaque, 40 random bytes, rotated+hashed server-side)
 └─ pollachi_auth   (user + both tokens, for rehydrate)
```

- **Password hashing:** bcrypt, `BCRYPT_ROUNDS = 12` (`modules/auth/auth.service.js:CONFIG`).
- **Refresh tokens never leave hashed:** stored as SHA-256, re-hashed on every use → stolen token can't be reused after a rotation.
- **Secure persistance:** backend hooks `pre('save')` encrypts `deliveryAddress.street` + `order.notes` and the user's `phone`/address fields with server-side RSA keys. On read they're decrypted via `post('init')`.
- **On the client** tokens live in `expo-secure-store` (Keystore/Keychain), never `AsyncStorage`; the axios interceptor transparently refreshes once on a 401 and clears state on refresh failure.

---

## Database Schemas

All documents were designed for status + time queries and reference integrity.

### Order (`order.model.js`)
```js
{
  userId,                    // ref User, indexed
  items: [{ productId, name, price, quantity, subtotal }],
  itemTotal, deliveryFee, platformFee, total,
  discount: { code, amount },
  status  // enum: pending/confirmed/preparing/ready/delivered/cancelled, indexed
  statusHistory: [{ status, changedAt, changedBy }],
  deliveryAddress: { street*, area, city, state, zip, phone*, altPhone, distance, timeInfo, lat, lng },
  deliveryDriverId,       // ref User (e.g. driver invoice)
  notes*,                 // AES/RSA encrypted at rest
  estimatedDelivery,        // createdAt + 2h at order time
  timestamps
}
// index → { status: 1, createdAt: -1 } for the admin dashboard
```
\* Encrypted at rest.

### User
```
name, email (unique), passwordHash, phone*, role (customer|admin|delivery),
fcmToken, refreshToken (hashed), isActive, lastActive,
addresses[{...encrypted phone/street}], favorites[ObjectId overrides]
```

### Product
```
name (indexed), description, price, category (indexed), imageUrl,
stock, isUnlimited, isAvailable,
kcal, spice (Mild/Medium/Hot), isVeg, quality, prepTime, location ("Pollachi Central"),
locationLat, locationLng
```

### Discount
```
name, description, discountPercentage (1..100),
targetType (all|category|product), targetValue,
window: startDate, endDate, startTime ("HH:mm"), endTime, daysOfWeek [0-6],
isActive
```

### Settings (singleton)
```
deliveryFee=40, freeDeliveryThreshold=500, platformFee=5,
activeCouponCode="SAVE10", couponDiscountPercent=10
```

### Review
```
userId, productId, rating  // unique index (userId × productId)
```

---

## Real-Time (Socket.IO)

### Server (`src/socket/socket.server.js`)
```js
io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGINS, credentials: true },
  transports: ["websocket","polling"],
  pingTimeout: 20_000, pingInterval: 10_000,
});
// JWT gate: every socket authenticates from handshake.auth.token.
io.use(async (socket, next) => {
  try { socket.user = jwt.verify(socket.handshake.auth.token, JWT_SECRET); next(); }
  catch { next(new Error("Unauthorized")); }
});
// on connect: admin → join("admin:dashboard"); client joins "order:{orderId}"
```

### Events
| Event | Direction | Notes |
|---|---|---|
| `join_order_room` | client → server | `{ orderId }`, subscribe to live lane |
| `new_order` | server → admin | to `admin:dashboard` |
| `order_update` | server → order room | `{ orderId, status, estimatedDelivery }` |
| `order_cancelled` | server → order room | `{ orderId, reason }` |
| `driver_assigned` | server → global | status forced `preparing` |
| `settings_updated` | server → global | on config save |

### Client (`mobile/src/services/socket.js`)
- Singleton `SocketService` reuses one connection, hot-swaps tokens, reconnects on demand.
- `useSocket` connects when the Redux token appears (and admin subscribes to `new_order`).
- `useOrderTracking(orderId)` auto-joins the order room and maps `order_update`/`order_cancelled` into Redux → `LiveTracker` UI.

---

## Pricing, Discounts & Fees Engine

Price of everything is computed **on the backend** at order time, and the mobile UI replicates the same logic in `utils/discountHelpers.js` so the cart preview matches the bill:

1. **Product price** is read from the DB (not the client).
2. **Best discount** — among active campaigns that apply to the product (via `targetType all/`category/`product`), the **largest** percentage wins. Campaigns filter by date window, `nights/weekend` rule, `startTime`/`endTime` and `daysOfWeek`.
3. **Stock** — decrement on order unless `isUnlimited`; `422 Insufficient stock` if needed.
4. **Fees** — `deliveryFee` waived if `itemTotal ≥ freeDeliveryThreshold`; + `platformFee`.
5. **Coupon** — optional code that must match `Settings.activeCouponCode` (e.g. `SAVE10`) → percentage off.
6. `total = itemTotal + fees − discounts`, rounded to 2 dp.

Cancellation restores inventory via `$inc`.

---

## Push Notifications

`App.js` → `expo-notifications`:
- Registers a device push token (device | emulator).
- Sends `PATCH /auth/fcm-token` to the backend.
- Foreground listener dispatches `orders/updateOrderStatus` into Redux.
- Android channel `default`, iOS `shouldShowAlert`/`Sound`.

FCM delivers via `firebase-admin` for order/status/broadcast, with `data: { orderId, status }` and localized titles for each of the 6 statuses (reused by `inactive_users.task.js` for re-engagement: `We Miss You! 🍔🍕`).

---

## Mobile Deep Dive

### Boot flow (`App.js`)
```
Splash → setupNotifications() → pollachi_cart & pollachi_auth rehydrate from SecureStore
      → Provider + AppNavigator
```

### Navigation (role-based)
- `AppNavigator` switches on `auth.user.role` and `isAuthenticated`:
  - unauthenticated → `Login`/`Register` stack
  - `admin` → `AdminRoot` (admin tabs)
  - `delivery` → `DeliveryRoot` (rider tabs)
  - else → `CustomerTabs` + `FoodDetail` modal
- **Customer** tabs in `AppNavigator.js`: `Home`, `Cart`, `Orders`, `Profile` — rendered by the custom **Dynamic-Island tab bar** (glassmorphic blur, live cart badge).
- **Admin** tabs in `AdminNavigator.js`: `LiveOrders`, `ManageMenu`, `History`, `Heatmap` (react-native-maps at Pollachi HQ ~10.662, 77.006), `Team`.
- **Delivery** tabs: `Dispatch` (Routes) + `Profile` (Rider ID).

### Redux state (`src/store/store.js`)
5 reducers with a custom `persistenceMiddleware` that mirrors cart & auth into SecureStore on relevant actions; `serializableCheck: false`.

| Slice | Highlights |
|---|---|
| `auth` | login/register, addresses, favorites, allUsers, createDriver, `rehydrateAuth` |
| `products` | fetch/list, cart actions (`addToCart`, `updateCartQuantity`, `clearCart`, `hydrateCart`), admin CRUD |
| `orders` | fetch/user, fetchAllOrders (admin), fetchDriverOrders, placeOrder, updateOrderStatusThunk, assignDriver, domain reducer `updateOrderStatus` |
| `settings` | fetchSettings, updateSettings |
| `discounts` | campaigns fetch/build banners |

### Hooks
- `useSocket` – starts/stops Socket.IO, admin subscribes to `new_order`.
- `useOrderTracking(orderId)` – subscribes to live lane.
- `useLocation` – expo-location: reverse-geocodes into an address, fallback `"Pollachi, TN"`.

### Visual identity
- `theme.js` – "Nature Lover" palette: `coconutGreen #2E7D32`, `natureDark #1B2E1E`, turmeric, palm/earth accent — every card soft-shadowed.

---

## REST API Reference

### Base URL
- Backend local: `http://localhost:5000` · health: `GET /api/health`
- Deployed: `https://pollachi-express-bk.vercel.app`

### Auth
| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| POST | `/api/auth/refresh` | public |
| POST | `/api/auth/logout` | user |
| PATCH | `/api/auth/fcm-token` | user |
| POST | `/api/auth/address` | user |
| PUT | `/api/auth/address/:index` | user |
| DELETE | `/api/auth/address/:id` | user |
| POST | `/api/auth/favorites/:productId` | user |
| GET | `/api/auth/users` | admin |
| POST | `/api/auth/drivers` | admin |
| PATCH | `/api/auth/users/:id/role` | admin |

### Products
| Method | Path | Auth |
|---|---|---|
| GET | `/api/products` | public |
| GET | `/api/products/ratings/all` | public |
| GET | `/api/products/:id` | public |
| GET | `/api/products/:id/reviews` | public |
| POST | `/api/products/:id/review` | user |
| POST | `/api/products` | admin |
| PUT | `/api/products/:id` | admin |
| DELETE | `/api/products/:id` | admin |

### Orders
| Method | Path | Auth |
|---|---|---|
| POST | `/api/orders` | customer/Zod |
| GET | `/api/orders` | user |
| GET | `/api/orders/:id` | user |
| GET | `/api/orders/admin/all` | admin |
| GET | `/api/orders/driver/all` | delivery |
| PUT | `/api/orders/:id/status` | admin \| delivery |
| DELETE | `/api/orders/:id` | admin |
| DELETE | `/api/orders/:id/destroy` | admin |

### Settings
| Method | Path | Auth |
|---|---|---|
| GET | `/api/settings` | public |
| PUT | `/api/settings` | admin |
| POST | `/api/settings/broadcast` | admin |
| POST | `/api/settings/notify-inactive` | admin |
| POST | `/api/settings/notify-user/:userId` | admin |

### Discounts
| Method | Path | Auth |
|---|---|---|
| GET | `/api/discounts` | public |
| GET | `/api/discounts/:id` | public |
| POST | `/api/discounts` | admin |
| PUT | `/api/discounts/:id` | admin |
| DELETE | `/api/discounts/:id` | admin |

---

## Environment Variables

```bash
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realtime-orders
JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me                        # currently unused (keep for future)
CLIENT_ORIGINS=http://localhost:3000,http://localhost:8081
FIREBASE_SERVICE_ACCOUNT=base64_encoded_service_account_json   # optional: disables FCM if absent
NODE_ENV=development
# RSA (field encryption) — generated by `npm run generate-keys` / scripts/generate-keys.js
RSA_PUBLIC_KEY=...
RSA_PRIVATE_KEY=...             # keep secret; lost keys = unreadable data
```

---

## Getting Started

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env            # set MONGODB_URI, JWT secrets, Firebase base64
npm run generate-keys           # creates RSA key dirs in .env (optional but recommended)
node create-admin.js            # creates admin account (admin@example.com / adminpassword123)
npm run dev                     # starts server + Socket.IO on :5000

# 2. Mobile
cd ../mobile
npm install
npx expo start                  # Expo Go / emulator; connect to :5000
```

> **Vercel note:** the backend ships in `server.js` with a `VERCEL` flag that intentionally skips the HTTP listener — Socket.IO and long-lived DB connections do not run serverlessly. For real-time features deploy the Node server on a persistent host (Fly/Railway/Render) and point `SOCKET_URL` in the app to it.

---

## Testing

Backend Jest suite is wired for unit + integration (`mongodb-memory-server` + `supertest`, sockets via `socket.io-client`):

```bash
cd backend
npm test   # jest --forceExit --detectOpenHandles
```

---

## Troubleshooting

| Symptom | Cause → Fix |
|---|---|
| Live updates never arrive | Client must `join_order_room` after connect & before status updates |
| Admin misses `new_order` | Socket handshake token missing `role: "admin"` → re-login with admin account |
| Push notifications silent | Re-fetch + `PATCH /auth/fcm-token`; enable channel on Android; request iOS permission |
| 401 on a fresh token | 15-min access expiry — axios interceptor must call `/auth/refresh` and retry |
| Refresh token reuse | Rotation — ensure your client stores the **new** refresh token returned on every refresh |
| Double orders | Add a unique `paymentRef` index + catch Mongo `11000` → 409 |
| Mobile socket drops in background | Raise `pingTimeout`; webkit `reconnection: true` |
| Encrypted fields unreadable | `RSA_PRIVATE_KEY` missing/mismatch in `.env`; `decrypt()` falls back to raw silently |

---

## License

v1.0 — Pollachi Express. See the original design guide (`realtime_order_workflow_guide.docx` / `docx_content.txt`) for the complete workflow narrative.