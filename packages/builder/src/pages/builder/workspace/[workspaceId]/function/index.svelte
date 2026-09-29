<script lang="ts">
  import { goto, params } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(() => {
    $goto(`/builder/workspace/${$params.workspaceId}/home?type=function`)
  })
</script>
