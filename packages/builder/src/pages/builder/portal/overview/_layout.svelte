<script>
  import { groups } from "stores/portal"
  import { onMount } from "svelte"

  let loaded = false

  onMount(async () => {
    await groups.actions.init()
    loaded = true
  })
</script>

{#if loaded}
  <slot />
{/if}
