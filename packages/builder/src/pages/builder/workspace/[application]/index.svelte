<script lang="ts">
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  $redirect

  onMount(() => {
    $redirect(`./home${window.location.search}`)
  })
</script>
