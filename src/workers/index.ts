import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { apiRoutes } from './api';

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

// Add debugging middleware
app.use('*', async (c, next) => {
  console.log(`Request path: ${c.req.path}`);
  try {
    await next();
  } catch (err) {
    console.error('Error in request:', err);
    throw err;
  }
});

// Mount API routes
app.route('/api', apiRoutes);

// Serve static files from the ASSETS binding
app.get('*', async (c) => {
  console.log(`Serving static asset: ${c.req.url}`);
  
  try {
    // Try to serve the requested file directly
    const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
    
    // If not found, serve index.html for SPA routing
    if (assetResponse.status === 404) {
      console.log(`Asset not found, serving index.html instead for path: ${c.req.path}`);
      const indexResponse = await c.env.ASSETS.fetch(
        new Request(new URL('/index.html', c.req.url), c.req)
      );
      return indexResponse;
    }
    
    return assetResponse;
  } catch (error) {
    console.error('Error serving static asset:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
});

export default app;
export type { Env }; 