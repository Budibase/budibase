<script>
  import { admin } from "stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  let loaded = false

  onMount(() => {
    if ($admin?.checklist?.adminUser) {
      $redirect("../")
    } else {
      loaded = true
    }
  })
</script>

{#if loaded}
  <slot />
{/if}
