<script lang="ts">
	import { onDestroy } from 'svelte';
	import { authStore } from '../stores/authStore';
	import { logout } from '../services/auth';
	
	let isAuthenticated = false;
	let loading = false;
	
	// Subscribe to auth store
	const unsubscribe = authStore.subscribe(state => {
		isAuthenticated = state.isAuthenticated;
	});
	
	// Clean up subscription
	onDestroy(() => {
		unsubscribe();
	});
	
	// Handle navigation
	function navigate(href: string) {
		window.history.pushState({}, '', href);
		// Dispatch a custom event to notify App.svelte of the navigation
		window.dispatchEvent(new CustomEvent('navigation'));
	}
	
	// Handle logout
	async function handleLogout() {
		loading = true;
		try {
			await logout();
			navigate('/');
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			loading = false;
		}
	}
</script>

<nav class="bg-gray-800 text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<a href="/" on:click|preventDefault={() => navigate('/')} class="text-white font-bold text-xl">Svelte + Hono + CF</a>
			</div>
			<div class="flex items-center">
				{#if isAuthenticated}
					<a href="/profile" on:click|preventDefault={() => navigate('/profile')} class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Profile</a>
					<button
						on:click={handleLogout}
						disabled={loading}
						class="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none"
					>
						{#if loading}
							<span>Loading...</span>
						{:else}
							<span>Logout</span>
						{/if}
					</button>
				{:else}
					<a href="/login" on:click|preventDefault={() => navigate('/login')} class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Login</a>
					<a href="/signup" on:click|preventDefault={() => navigate('/signup')} class="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Sign Up</a>
				{/if}
			</div>
		</div>
	</div>
</nav> 