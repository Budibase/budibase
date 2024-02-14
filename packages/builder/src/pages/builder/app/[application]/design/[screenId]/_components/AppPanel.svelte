<script>
  import DevicePreviewSelect from "./DevicePreviewSelect.svelte"
  import AppPreview from "./AppPreview.svelte"
  import { screenStore, appStore } from "stores/builder"
  import UndoRedoControl from "components/common/UndoRedoControl.svelte"
</script>

<div class="app-panel">
  <div class="header">
    <div class="header-left">
      <UndoRedoControl store={screenStore.history} />
    </div>
    <div class="header-right">
      {#if $appStore.clientFeatures.devicePreview}
        <DevicePreviewSelect />
      {/if}
    </div>
  </div>
  <div class="content">
    {#key $appStore.version}
      <AppPreview />
    {/key}
  </div>
</div>

<style>
  .app-panel {
    min-width: 410px;
    flex: 1 1 auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 9px var(--spacing-m);
  }
  .header {
    display: flex;
    margin-bottom: 9px;
  }

  .header-left :global(div) {
    border-right: none;
  }
  .header-right {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .content {
    flex: 1 1 auto;
  }
</style>
