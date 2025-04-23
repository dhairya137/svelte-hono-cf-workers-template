<script>
  export let id = '';
  export let label = '';
  export let required = false;
  export let helpText = '';
</script>

<div class="mb-4">
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  <slot />
  
  {#if helpText}
    <p class="mt-1 text-sm text-gray-500">{helpText}</p>
  {/if}
</div> 