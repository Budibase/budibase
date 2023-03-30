<script>
  import { getContext } from "svelte"

  const { sidePanelRowId } = getContext("sheet")

  $: visible = $sidePanelRowId != null
</script>

<div class="side-panel" class:visible>some content</div>

<style>
  .side-panel {
    width: 320px;
    transform: translateX(100%);
    transition: transform 130ms ease-out;
  }
  .side-panel.visible {
    transform: translateX(0);
  }
</style>
