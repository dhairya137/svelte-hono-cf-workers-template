<script lang="ts">
  import { onMount } from 'svelte';

  interface APIData {
    message: string;
    timestamp: string;
    [key: string]: any;
  }
  
  let apiData: APIData | null = null;
  let userData: APIData | null = null;
  let loading = false;
  let userLoading = false;
  let userId = '1';

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

<style>
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
