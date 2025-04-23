<script>
  import { goto } from '$lib/utils/navigation';
  import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
  
  function handleLoginSuccess() {
    // Redirect to dashboard/home page after successful login
    goto('/');
  }
</script>

<AuthLayout title="Log in to your account">
  <LoginForm onLoginSuccess={handleLoginSuccess} />
</AuthLayout> 