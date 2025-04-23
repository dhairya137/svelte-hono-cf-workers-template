<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$lib/utils/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { logout } from '$lib/services/auth';
  import ProtectedRoute from '$lib/components/auth/ProtectedRoute.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  
  let user = get(authStore).user;
  let loading = false;
  
  onMount(() => {
    // Subscribe to auth store changes
    const unsubscribe = authStore.subscribe(state => {
      user = state.user;
    });
    
    // Unsubscribe on component destroy
    return unsubscribe;
  });
  
  async function handleLogout() {
    loading = true;
    await logout();
    loading = false;
    goto('/login');
  }
</script>

<ProtectedRoute>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 bg-blue-50">
        <h2 class="text-xl font-semibold text-gray-800">User Profile</h2>
        <p class="mt-1 text-sm text-gray-600">Personal information and account details.</p>
      </div>
      
      <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        {#if user}
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">First Name</dt>
              <dd class="mt-1 text-lg text-gray-900">{user.firstName}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Last Name</dt>
              <dd class="mt-1 text-lg text-gray-900">{user.lastName}</dd>
            </div>
            
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Email Address</dt>
              <dd class="mt-1 text-lg text-gray-900">{user.email}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Account Created</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
          </dl>
          
          <div class="mt-8 flex justify-end">
            <Button 
              variant="danger" 
              on:click={handleLogout}
              loading={loading}
            >
              Sign Out
            </Button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</ProtectedRoute> 