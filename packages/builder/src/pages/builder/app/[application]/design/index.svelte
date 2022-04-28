<script>
  import { store, selectedScreen } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  let loaded = false

  onMount(() => {
    if ($selectedScreen) {
      $redirect(`./${$selectedScreen._id}`)
    } else if ($store.screens?.length) {
      $redirect(`./${$store.screens[0]._id}`)
    } else {
      loaded = true
    }
  })
</script>

{#if loaded}
  You need to create a screen!
{/if}
