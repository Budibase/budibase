<script>
  import { params, redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(() => {
    $redirect(`../../query/new/${$params.datasourceId}`)
  })
</script>
