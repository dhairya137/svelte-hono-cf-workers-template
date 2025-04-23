<script lang="ts">
  // Parse user id from the current path (manual routing)
  let userId = '';
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/users\/([^/]+)/);
    if (match) {
      userId = match[1];
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">User Page</h1>
<p class="mb-2">User ID: <span class="font-mono">{userId}</span></p>

<!-- You can fetch and display more user info here -->
