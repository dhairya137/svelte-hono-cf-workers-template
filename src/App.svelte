<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from './lib/components/Nav.svelte';
	import { checkAuth } from './lib/services/auth';
	
	// Route components
	import Home from './routes/Home.svelte';
	import Login from './routes/login.svelte';
	import Signup from './routes/signup.svelte';
	import Profile from './routes/profile.svelte';
	
	// Current route
	let currentRoute = '/';
	
	// Update current route on navigation
	function handleNavigation() {
		currentRoute = window.location.pathname;
	}
	
	// Listen for navigation events
	onMount(() => {
		// Initial authentication check
		checkAuth();
		
		// Initial route
		handleNavigation();
		
		// Listen for popstate (back/forward) events
		window.addEventListener('popstate', handleNavigation);
		
		// Listen for custom navigation events from Nav component
		window.addEventListener('navigation', handleNavigation);
		
		// Cleanup
		return () => {
			window.removeEventListener('popstate', handleNavigation);
			window.removeEventListener('navigation', handleNavigation);
		};
	});
</script>

<!-- Navigation -->
<Nav />

<!-- Router outlet -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	{#if currentRoute === '/'}
		<Home />
	{:else if currentRoute === '/login'}
		<Login />
	{:else if currentRoute === '/signup'}
		<Signup />
	{:else if currentRoute === '/profile'}
		<Profile />
	{:else}
		<div>
			<h1>Page not found</h1>
			<p>The page you are looking for does not exist.</p>
			<a href="/" class="text-blue-600 hover:underline">Go back home</a>
		</div>
	{/if}
</div>

<style>
	:global(h1) {
		color: #ff3e00;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	:global(p) {
		color: #555;
		margin-bottom: 2rem;
	}

	:global(.api-section) {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	:global(.api-card) {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 4px;
	}

	:global(h3) {
		margin-bottom: 1rem;
		color: #333;
	}

	:global(button) {
		background-color: #ff3e00;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 0.5rem;
	}

	:global(button:disabled) {
		background-color: #ccc;
	}

	:global(.api-result) {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #f8f8f8;
		border-radius: 4px;
	}

	:global(pre) {
		white-space: pre-wrap;
		word-break: break-word;
	}

	:global(.input-group) {
		margin-bottom: 0.5rem;
	}

	:global(label) {
		display: block;
		margin-bottom: 0.25rem;
	}

	:global(input) {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		width: 100%;
		max-width: 200px;
	}
</style>
