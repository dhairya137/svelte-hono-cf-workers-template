# Svelte 5 + Hono + Cloudflare Workers Template

A full‑stack starter combining a Svelte 5 SPA frontend with Runes for reactivity and a Hono API backend—all served from a single Cloudflare Worker. It includes JWT‑based authentication (RS256), CSRF protection, manual client‑side routing, and D1 database integration.

## Features

- **Svelte 5 + Runes**: Reactive frontend components and manual SPA routing.
- **Hono**: Lightweight, TypeScript‑first API routing on Cloudflare Workers.
- **Cloudflare Workers**: Single Worker serving both static assets and API.
- **D1 Database**: SQLite‑compatible, serverless user store.
- **JWT Auth (RS256)**: Secure token issuance and verification using environment‑injected RSA keys.
- **CSRF Tokens**: Double‑submit pattern with HTTP‑only auth and sameSite CSRF cookies.
- **Protected Routes**: Frontend (`<ProtectedRoute/>`) and backend guards.
- **Tailwind CSS**: Utility‑first styling.
- **Vite**: Fast builds and hot‑reload.
- **Wrangler Integration**: One‑command develop and deploy.

## Architecture & Flow

1. **Frontend SPA** (`src/App.svelte`):
   - Tracks `currentRoute` from `window.location.pathname`.
   - Uses `goto()` (dispatches `popstate` + custom `navigation` events) for in‑app links.
   - Renders route components: `Home`, `Login`, `Signup`, `Profile`, or 404.
2. **Auth Layout & Forms**:
   - `LoginForm.svelte` and `SignupForm.svelte` call `$lib/services/auth`.
   - On success, `AuthStore` updates and calls `onLoginSuccess`, triggering `goto('/profile')`.
3. **API Layer** (`src/workers/worker.ts`):
   - Hono app serves static assets and `/api/*` endpoints.
   - `AuthController` handlers read `c.env.JWT_PRIVATE_KEY` & `JWT_PUBLIC_KEY`.
   - UserRepo (D1) stores/verifies users; passwords hashed with SHA‑256 + salt.
   - `createJwt()` signs tokens; cookies set via `hono/cookie`.
4. **ProtectedRoute** (`ProtectedRoute.svelte`):
   - On mount, checks `authStore` or calls `/api/auth/me`.
   - Redirects unauthenticated users to `/login`.

## Folder Structure

```
├─ src/
│  ├─ App.svelte            # SPA router
│  ├─ worker.ts             # Hono entrypoint
│  ├─ lib/
│  │  ├─ components/
│  │  │  ├─ Nav.svelte
│  │  │  ├─ auth/           # AuthLayout, LoginForm, ProtectedRoute
│  │  │  └─ ui/             # Button, Input, FormField, ErrorMessage
│  │  ├─ services/          # auth.ts (frontend), api.ts
│  │  ├─ stores/            # authStore.ts
│  │  └─ utils/
│  │     └─ navigation.ts   # `goto`, `back`, etc.
│  └─ routes/               # Svelte pages: Home, login, signup, profile
├─ package.json
├─ wrangler.toml            # Cloudflare config & env binding
└─ README.md                # ← This file
```

## Prerequisites

- Node.js ≥ 18
- npm
- Wrangler CLI (`npm install -g wrangler`)

## Installation

```bash
git clone https://github.com/dhairya137/svelte-hono-cf-workers-template.git
cd svelte-hono-cf-workers-template
npm install
```

## Development

Start the dev server (build + local Worker simulation):
```bash
npm run dev
# Visit http://localhost:8787
```

## Environment Variables & Secrets

Configure RSA keys for JWT in your `wrangler.toml` or via secrets:

**wrangler.toml**:
```toml
name = "svelte-hono-cf-workers-template"

[vars]
JWT_PUBLIC_KEY  = "<your‑public‑JWK‑JSON>"
JWT_PRIVATE_KEY = "<your‑private‑PKCS8‑PEM>"

[dev.vars]
# optional local overrides
```

Or at runtime (production):
```bash
npx wrangler secret put JWT_PUBLIC_KEY
npx wrangler secret put JWT_PRIVATE_KEY
```

## Testing Auth Flow

1. **Sign up** → sets `auth_token` and `csrf_token` cookies.
2. **Login** → redirects to `/profile` and updates Nav links.
3. **Access `/profile`** → guarded by `<ProtectedRoute/>` and server `/api/auth/me`.
4. **Logout** → clears cookies and redirects to home.

## Deployment

Build & deploy in one step:
```bash
npm run deploy
```
Your site and API will be live at the Workers domain shown by Wrangler.

## License

MIT
