# Svelte 5 + Hono + Cloudflare Workers Template

This is a starter template that combines Svelte 5 (with Runes) for the frontend with Hono running on Cloudflare Workers for the backend API. The entire application is served from a single Cloudflare Worker, providing a modern, unified full-stack development experience.

## Features

- 🔥 **Svelte 5** with Runes for reactive state management
- ⚡️ **Hono** for backend API routing
- 🌩️ **Cloudflare Workers** for serverless deployment
- 🔄 **Single worker** serving both the static frontend and API
- 📝 **TypeScript** throughout
- 🎨 **TailwindCSS** for styling
- 📦 **Vite** for fast builds
- 🔒 **SPA routing** support

## Quick Start

1. Clone this repository

   ```bash
   git clone https://github.com/dhairya137/svelte-hono-cf-workers-template.git my-app
   cd my-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start development server

   ```bash
   npm run dev
   ```

4. Build for production

   ```bash
   npm run build
   ```

5. Deploy to Cloudflare Workers
   ```bash
   npm run deploy
   ```

## Project Structure

```bash
├── src/                  # Source code
│   ├── App.svelte        # Main Svelte component
│   ├── main.ts           # Svelte entry point
│   ├── app.css           # Global CSS
│   ├── worker.ts         # Worker entry point
│   └── workers/          # Worker code
│       ├── index.ts      # Main worker (serves frontend + API)
│       └── api.ts        # API routes using Hono
├── public/               # Static assets
├── index.html            # HTML entry point
├── svelte.config.js      # Svelte configuration
├── vite.config.ts        # Vite configuration
└── wrangler.toml         # Cloudflare Workers configuration
```

## How It Works

### Frontend (Svelte 5)

The Svelte 5 app starts in `src/main.ts`, which mounts the main `App.svelte` component. The app uses Svelte 5's Runes for state management (`$state`, etc.) and modern event handling attributes (`onclick`).

```javascript
// Example from src/main.ts
import { mount } from 'svelte';
const app = mount(App, {
	target: document.getElementById('app'),
	props: {}
});
```

```js
<!-- Example from App.svelte -->
<script lang="ts">
	let count = $state(0);

	function increment() {
		count++;
	}
</script>

<button onclick={increment}>Count: {count}</button>
```

### Backend (Hono)

The API is built with Hono in `src/workers/api.ts`. Hono provides a modern, Express-like API for creating routes.

```typescript
// Example from src/workers/api.ts
import { Hono } from 'hono';

const api = new Hono();

api.get('/hello', (c) => {
	return c.json({
		message: 'Hello from Hono!',
		timestamp: new Date().toISOString()
	});
});

export const apiRoutes = api;
```

### Integration (Cloudflare Workers)

Both the frontend and backend are served from a single Cloudflare Worker, configured in `src/workers/index.ts`. The worker serves the static Svelte app and routes API requests to Hono.

```typescript
// Example from src/workers/index.ts
import { Hono } from 'hono';
import { apiRoutes } from './api';

const app = new Hono();

// Mount API routes
app.route('/api', apiRoutes);

// Serve static files
app.get('*', async (c) => {
	// ... serve static files or fallback to index.html
});

export default app;
```

## API Examples

The template includes example API endpoints:

- `GET /api/hello` - Returns a greeting message
- `GET /api/users/:id` - Returns user data for a given ID

## Customization

### Adding New API Routes

Add new routes in `src/workers/api.ts`:

```typescript
api.get('/new-endpoint', (c) => {
	return c.json({
		message: 'This is a new endpoint',
		data: {
			/* your data */
		}
	});
});
```

### Adding New Frontend Components

Create new Svelte components in the `src` directory and import them in `App.svelte`.

### Environment Variables

Add environment variables in `wrangler.toml`:

```toml
[vars]
MY_VARIABLE = "my-value"
```

## Deployment

This template is configured for deployment to Cloudflare Workers:

1. Configure your Cloudflare account in Wrangler

   ```bash
   npx wrangler login
   ```

2. Deploy your application
   ```bash
   npm run deploy
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
