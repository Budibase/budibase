<script>
  import DevicePreviewSelect from "./DevicePreviewSelect.svelte"
  import AppPreview from "./AppPreview.svelte"
  import { store, screenHistoryStore } from "builderStore"
  import UndoRedoControl from "components/common/UndoRedoControl.svelte"
  import { isActive } from "@roxi/routify"
</script>

<div class="app-panel">
  <div class="header">
    <div class="header-left">
      {#if $isActive("./screens") || $isActive("./components")}
        <UndoRedoControl store={screenHistoryStore} />
      {/if}
    </div>
    <div class="header-right">
      {#if $store.clientFeatures.devicePreview}
        <DevicePreviewSelect />
      {/if}
    </div>
  </div>
  <div class="content">
    {#key $store.version}
      <AppPreview />
    {/key}
  </div>
</div>

<style>
  .app-panel {
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
