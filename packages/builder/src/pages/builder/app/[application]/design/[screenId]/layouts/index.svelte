<script>
  import { store } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  onMount(() => {
    if ($store.layouts?.length) {
      $redirect(`./${$store.layouts[0]._id}`)
    }
    // The redirection when no layouts exist is handled by the routify layout
  })
</script>
