import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Define the environment interface for Cloudflare Workers
interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

// Create the main app with proper typing
const app = new Hono<{ Bindings: Env }>();

// Apply CORS middleware
app.use('*', cors());

// API routes
const api = new Hono<{ Bindings: Env }>();

api.get('/', (c) => {
  return c.json({
    message: 'API is working!',
    version: '1.0.0'
  });
});

api.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Cloudflare Workers!!!',
    timestamp: new Date().toISOString()
  });
});

api.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({
    userId: id,
    name: `User ${id}`,
    timestamp: new Date().toISOString()
  });
});

api.post('/data', async (c) => {
  const body = await c.req.json();
  return c.json({
    message: 'Data received!',
    data: body,
    timestamp: new Date().toISOString()
  });
});

// Mount the API under /api
app.route('/api', api);

// Serve static files from the ASSETS binding
app.get('*', async (c) => {
  try {
    // Serve the static asset from the ASSETS binding
    return await c.env.ASSETS.fetch(c.req.raw);
  } catch (error) {
    console.error('Error serving static asset:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

export default app; 