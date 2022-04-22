<script>
  import { allScreens } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  let loaded = false

  onMount(() => {
    if ($allScreens?.length) {
      $redirect(`./${$allScreens[0]._id}`)
    } else {
      loaded = true
    }
  })
</script>

{#if loaded}
  You need to create a screen!
{/if}
