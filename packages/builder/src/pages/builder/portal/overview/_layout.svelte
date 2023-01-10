<script>
  import { apps, groups, licensing } from "stores/portal"
  import { onMount } from "svelte"

  let loaded = !!$apps?.length

  onMount(async () => {
    if (!loaded) {
      await apps.load()
      if ($licensing.groupsEnabled) {
        await groups.actions.init()
      }
      loaded = true
    }
  })
</script>

{#if loaded}
  <slot />
{/if}
