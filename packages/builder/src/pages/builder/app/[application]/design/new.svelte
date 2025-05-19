<script lang="ts">
  import { onMount } from "svelte"
  import NewScreen from "./_components/NewScreen/index.svelte"

  let newScreenModal: NewScreen

  $: workspaceAppId =
    new URLSearchParams(window.location.search).get("workspaceAppId") ||
    "default"

  onMount(() => {
    newScreenModal.show()
  })
</script>

<div class="new-screen-picker">
  <NewScreen bind:this={newScreenModal} inline submitOnClick {workspaceAppId} />
</div>

<style>
  .new-screen-picker {
    justify-items: center;
  }

  .new-screen-picker :global(.spectrum-Modal) {
    border: none;
    background: none;
  }
</style>
