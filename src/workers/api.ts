import { Hono } from 'hono';
import { authRoutes } from './auth/routes';

// Create a Hono app for API routes
const api = new Hono();

// Basic routes used in App.svelte
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

// Mount auth routes
api.route('/auth', authRoutes);

// Example of how to add more routes:
// api.get('/example', (c) => {
//   return c.json({
//     message: 'This is an example endpoint',
//     data: { key: 'value' }
//   });
// });

// Export the API routes
export const apiRoutes = api;
