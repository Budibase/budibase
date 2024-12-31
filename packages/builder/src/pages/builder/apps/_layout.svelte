<script>
  import { auth } from "@/stores/portal"
</script>

{#if $auth.user}
  <slot />
{/if}
