<script lang="ts">
  import { goto as gotoStore } from "@roxi/routify"
  import { onMount } from "svelte"

  $: goto = $gotoStore

  onMount(() => {
    goto("../home")
  })
</script>
