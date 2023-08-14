<script>
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  onMount(() => {
    $redirect(`./screen`)
  })
</script>
