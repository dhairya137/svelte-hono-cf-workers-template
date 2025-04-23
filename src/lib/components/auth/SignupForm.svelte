<script lang="ts">
  import { signup } from '$lib/services/auth';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
  
  let { onSignupSuccess = () => {} } = $props();
  
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let errorMessage = '';
  let errors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Password strength validation
  function isStrongPassword(password: string): boolean {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  }
  
  async function handleSubmit() {
    // Reset errors
    errorMessage = '';
    errors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    // Validate inputs
    let isValid = true;
    
    if (!firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!isStrongPassword(password)) {
      errors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Submit form
    loading = true;
    
    try {
      const result = await signup({
        firstName,
        lastName,
        email,
        password
      });
      
      if (result.success) {
        // Call success callback
        onSignupSuccess();
      } else {
        errorMessage = result.error || 'An error occurred during signup';
        
        // Add server validation errors
        if (result.errors) {
          errors = { ...errors, ...result.errors };
        }
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
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField id="firstName" label="First Name" required={true}>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          bind:value={firstName}
          error={errors.firstName}
          required
        />
      </FormField>
      
      <FormField id="lastName" label="Last Name" required={true}>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Enter your last name"
          bind:value={lastName}
          error={errors.lastName}
          required
        />
      </FormField>
    </div>
    
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
    
    <FormField id="password" label="Password" required={true} helpText="Must be at least 8 characters with uppercase, lowercase, number, and special character">
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Create a password"
        bind:value={password}
        error={errors.password}
        required
      />
    </FormField>
    
    <FormField id="confirmPassword" label="Confirm Password" required={true}>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        bind:value={confirmPassword}
        error={errors.confirmPassword}
        required
      />
    </FormField>
    
    <Button type="submit" fullWidth={true} loading={loading}>
      Create Account
    </Button>
    
    <div class="mt-4 text-center text-sm text-gray-600">
      Already have an account? <a href="/login" class="text-blue-600 hover:underline">Log in</a>
    </div>
  </form>
</div> 