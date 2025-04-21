<script lang="ts">
  import { onMount } from 'svelte';

  interface APIData {
    message: string;
    timestamp: string;
    [key: string]: any;
  }
  
  let apiData = $state<APIData | null>(null);
  let userData = $state<APIData | null>(null);
  let loading = $state(false);
  let userLoading = $state(false);
  let userId = $state('1');

  async function fetchApiData() {
    loading = true;
    try {
      const response = await fetch('/api/hello');
      apiData = await response.json();
    } catch (error) {
      console.error('Error fetching API data:', error);
    } finally {
      loading = false;
    }
  }
  
  async function fetchUserData() {
    userLoading = true;
    try {
      const response = await fetch(`/api/users/${userId}`);
      userData = await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      userLoading = false;
    }
  }
</script>

<h1>Svelte + Hono on Cloudflare Workers</h1>
<p>A purely static Svelte frontend with Hono API backend</p>

<div class="api-section">
  <h2>Hono API Integration Demo</h2>
  
  <div class="api-card">
    <h3>Basic API</h3>
    <button onclick={fetchApiData} disabled={loading}>
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
    <button onclick={fetchUserData} disabled={userLoading}>
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

<style>
  h1 {
    color: #ff3e00;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #555;
    margin-bottom: 2rem;
  }

  .api-section {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .api-card {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
  
  h3 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  button {
    background-color: #ff3e00;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  
  .api-result {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f8f8f8;
    border-radius: 4px;
  }
  
  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .input-group {
    margin-bottom: 0.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.25rem;
  }
  
  input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    max-width: 200px;
  }
</style> 