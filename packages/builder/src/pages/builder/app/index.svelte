<script>
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(() => {
    $redirect("/builder/workspace")
  })
</script>
