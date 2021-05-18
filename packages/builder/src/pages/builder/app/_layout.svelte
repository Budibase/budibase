<script>
  import { auth } from "stores/backend"
</script>

{#if $auth.user}
  <slot />
{/if}
