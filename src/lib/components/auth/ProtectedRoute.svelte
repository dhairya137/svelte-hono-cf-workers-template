<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$lib/utils/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { checkAuth } from '$lib/services/auth';
  
  let { redirectTo = '/login' } = $props();
  
  let isLoading = true;
  let isAuthenticated = false;
  
  onMount(async () => {
    // Check auth state from store first
    const authState = get(authStore);
    isAuthenticated = authState.isAuthenticated;
    
    if (!isAuthenticated) {
      // If not authenticated in store, check with server
      isAuthenticated = await checkAuth();
    }
    
    isLoading = false;
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      goto(redirectTo);
    }
  });
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-32">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
  </div>
{:else if isAuthenticated}
  <slot />
{/if} 