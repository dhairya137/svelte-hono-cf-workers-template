<script lang="ts">
  import { goto } from '$lib/utils/navigation';
  import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
  
  import type { User } from '$lib/types/auth';
  function handleLoginSuccess(user: User) {
    // Redirect to user-specific page after successful login
    goto(`/users/${user.id}`);
  }
</script>

<AuthLayout title="Log in to your account">
  <LoginForm onLoginSuccess={handleLoginSuccess} />
</AuthLayout> 