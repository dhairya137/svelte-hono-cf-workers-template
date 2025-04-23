<script>
  import { onMount } from 'svelte';
  
  let { 
    id = '',
    name = '',
    type = 'text',
    placeholder = '',
    value = $bindable(''),
    required = false,
    disabled = false,
    error = ''
  } = $props();
  
  // Format classes based on state
  const classes = $derived(`
    w-full rounded-md border px-3 py-2 text-sm transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-1
    ${error 
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
    ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : ''}
  `);
</script>

<input
  id={id}
  name={name}
  type={type}
  placeholder={placeholder}
  required={required}
  disabled={disabled}
  class={classes}
  value={value}
  on:input
  on:focus
  on:blur
/>

{#if error}
  <p class="mt-1 text-sm text-red-600">{error}</p>
{/if} 