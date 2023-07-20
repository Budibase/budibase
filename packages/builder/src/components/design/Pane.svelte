<script>
  import { getContext } from "svelte"

  export let title

  const createPaneStore = getContext("createPaneStore")

  $: paneStore = createPaneStore(title)
</script>

{#if $paneStore}
  <div class="pane">
    <slot />
  </div>
{/if}

<style>
  .pane {
    padding: 13px;
  }
</style>
