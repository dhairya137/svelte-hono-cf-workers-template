import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { RequestEvent } from '@sveltejs/kit';

// Create Hono app
const api = new Hono();

// Apply CORS middleware
api.use('*', cors());

// Define API routes
api.get('/', (c) => {
  return c.json({
    message: 'API is working!',
    version: '1.0.0'
  });
});

api.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Cloudflare Workers!!!!',
    timestamp: new Date().toISOString()
  });
});

// Add a route with path parameters
api.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({
    userId: id,
    name: `User ${id}`,
    timestamp: new Date().toISOString()
  });
});

// Add a POST example
api.post('/data', async (c) => {
  const body = await c.req.json();
  return c.json({
    message: 'Data received!',
    data: body,
    timestamp: new Date().toISOString()
  });
});

// Handler for all HTTP methods
export async function GET(event: RequestEvent) {
  return handleHonoRequest(event);
}

export async function POST(event: RequestEvent) {
  return handleHonoRequest(event);
}

export async function PUT(event: RequestEvent) {
  return handleHonoRequest(event);
}

export async function DELETE(event: RequestEvent) {
  return handleHonoRequest(event);
}

export async function PATCH(event: RequestEvent) {
  return handleHonoRequest(event);
}

export async function OPTIONS(event: RequestEvent) {
  return handleHonoRequest(event);
}

// Helper function to transform SvelteKit request to Hono request
async function handleHonoRequest(event: RequestEvent) {
  // Get the path parameter
  const path = event.params.path || '';
  
  // Construct the URL for Hono routing
  const url = new URL(event.request.url);
  
  // Make Hono handle the route without the /api prefix
  url.pathname = `/${path}`;
  
  // Create a new request with the modified URL
  const honoRequest = new Request(url, event.request);
  
  // Process with Hono
  const response = await api.fetch(honoRequest);
  return response;
} 