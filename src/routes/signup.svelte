<script>
  import { goto } from '$lib/utils/navigation';
  import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
  import SignupForm from '$lib/components/auth/SignupForm.svelte';
  
  function handleSignupSuccess() {
    // Redirect to dashboard/home page after successful signup
    goto('/');
  }
</script>

<AuthLayout title="Create your account">
  <SignupForm onSignupSuccess={handleSignupSuccess} />
</AuthLayout> 