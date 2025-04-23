<script lang="ts">
	interface APIData {
		message: string;
		timestamp: number;
	}

	let apiData: APIData | null = null;
	let userData: any | null = null;
	let loading = false;
	let userLoading = false;
	let userId = '';

	async function fetchApiData() {
		loading = true;
		try {
			const response = await fetch('/api/hello');
			apiData = await response.json();
		} catch (error) {
			console.error('Failed to fetch API data:', error);
		} finally {
			loading = false;
		}
	}

	async function fetchUserData() {
		if (!userId) {
			userData = null;
			return;
		}

		userLoading = true;
		try {
			const response = await fetch(`/api/users/${userId}`);
			userData = await response.json();
		} catch (error) {
			console.error('Failed to fetch user data:', error);
		} finally {
			userLoading = false;
		}
	}
</script>

<main>
	<h1>Svelte5-Hono-CF Template</h1>
	<p>A modern Svelte 5 frontend with Hono API on Cloudflare Workers</p>

	<div class="mt-8 mb-4 flex space-x-4">
		<a href="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200">
			Go to Login Page
		</a>
		<a href="/signup" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700">
			Go to Signup Page
		</a>
	</div>

	<div class="api-section">
		<h2>Hono API Integration Demo</h2>

		<div class="api-card">
			<h3>Basic API</h3>
			<button on:click={fetchApiData} disabled={loading}>
				{loading ? 'Loading...' : 'Fetch API Data'}
			</button>

			{#if apiData}
				<div class="api-result">
					<h4>API Response:</h4>
					<pre>{JSON.stringify(apiData, null, 2)}</pre>
				</div>
			{/if}
		</div>

		<div class="api-card">
			<h3>User API with Parameters</h3>
			<div class="input-group">
				<label for="userId">User ID:</label>
				<input id="userId" type="text" bind:value={userId} />
			</div>
			<button on:click={fetchUserData} disabled={userLoading}>
				{userLoading ? 'Loading...' : 'Fetch User Data'}
			</button>

			{#if userData}
				<div class="api-result">
					<h4>User Data:</h4>
					<pre>{JSON.stringify(userData, null, 2)}</pre>
				</div>
			{/if}
		</div>
	</div>
</main> 