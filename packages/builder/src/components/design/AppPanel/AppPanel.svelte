<script>
  import ComponentSelectionList from "./ComponentSelectionList.svelte"
  import DevicePreviewSelect from "./DevicePreviewSelect.svelte"
  import ThemeEditor from "./ThemeEditor.svelte"
  import AppThemeSelect from "./AppThemeSelect.svelte"
  import AppPreview from "./AppPreview.svelte"
  import { store } from "builderStore"
</script>

<div class="app-panel">
  <div class="header">
    <ComponentSelectionList />
    {#if $store.clientFeatures.devicePreview}
      <DevicePreviewSelect />
    {/if}
    {#if $store.clientFeatures.customThemes}
      <ThemeEditor />
    {:else if $store.clientFeatures.spectrumThemes}
      <AppThemeSelect />
    {/if}
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
    gap: var(--spacing-m);
    padding: var(--spacing-l) var(--spacing-xl);
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
    margin-left: -6px;
  }
  .header > :global(*) {
    flex: 0 0 auto;
  }
  .header > :global(*:first-child) {
    flex: 1 1 auto;
  }
  .content {
    flex: 1 1 auto;
  }
</style>
