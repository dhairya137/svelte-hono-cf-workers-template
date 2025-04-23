<script lang="ts">
  import { login } from '$lib/services/auth';
  import { authStore } from '$lib/stores/authStore';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
  import type { LoginCredentials, AuthResponse } from '$lib/types/auth';
  
  // Props
  import type { User } from '$lib/types/auth';
export let onLoginSuccess: (user: User) => void = () => {};
  
  // State
  let email = '';
  let password = '';
  let remember = false;
  let loading = false;
  let errorMessage = '';
  let errors = {
    email: '',
    password: ''
  };
  
  async function handleSubmit() {
    // Reset errors
    errorMessage = '';
    errors = { email: '', password: '' };
    
    // Basic validation
    let isValid = true;
    
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Submit form
    loading = true;
    
    try {
      const result = await login({ email, password, remember });
      
      if (result.success && result.user) {
        // Call success callback with user
        onLoginSuccess(result.user);
      } else {
        errorMessage = result.error || 'An error occurred during login';
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full max-w-md mx-auto">
  <ErrorMessage message={errorMessage} />
  
  <form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Log In</h2>
    
    <FormField id="email" label="Email" required={true}>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        bind:value={email}
        error={errors.email}
        required
      />
    </FormField>
    
    <FormField id="password" label="Password" required={true}>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        bind:value={password}
        error={errors.password}
        required
      />
    </FormField>
    
    <div class="flex items-center mt-4 mb-6">
      <input 
        id="remember"
        name="remember"
        type="checkbox"
        class="h-4 w-4 text-blue-600 rounded border-gray-300"
        bind:checked={remember}
      />
      <label for="remember" class="ml-2 text-sm text-gray-700">
        Remember me
      </label>
    </div>
    
    <Button type="submit" fullWidth={true} loading={loading}>
      Log In
    </Button>
    
    <div class="mt-4 text-center text-sm text-gray-600">
      Don't have an account? <a href="/signup" class="text-blue-600 hover:underline">Sign up</a>
    </div>
  </form>
</div> 