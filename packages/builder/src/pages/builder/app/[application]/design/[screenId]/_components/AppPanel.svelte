<script>
  import AppPreview from "./AppPreview.svelte"
  import {
    screenStore,
    appStore,
    selectedScreen,
    previewStore,
  } from "@/stores/builder"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import ScreenErrorsButton from "./ScreenErrorsButton.svelte"
  import { ActionButton, Divider } from "@budibase/bbui"
  import { ScreenVariant } from "@budibase/types"
  import ThemeSettings from "./Theme/ThemeSettings.svelte"

  $: mobile = $previewStore.previewDevice === "mobile"
  $: isPDF = $selectedScreen?.variant === ScreenVariant.PDF

  const previewApp = () => {
    previewStore.showPreview(true)
  }

  const togglePreviewDevice = () => {
    previewStore.setDevice(mobile ? "desktop" : "mobile")
  }
</script>

<div class="app-panel">
  <div class="drawer-container" />
  <div class="header">
    <div class="header-left">
      <UndoRedoControl store={screenStore.history} />
    </div>
    <div class="header-right">
      <div class="actions">
        {#if !isPDF}
          {#if $appStore.clientFeatures.devicePreview}
            <ActionButton
              quiet
              icon={mobile ? "DevicePhone" : "DeviceDesktop"}
              selected
              on:click={togglePreviewDevice}
            />
          {/if}
          <ThemeSettings />
        {/if}
        <ScreenErrorsButton />
      </div>
      <Divider vertical />
      <ActionButton quiet icon="PlayCircle" on:click={previewApp}>
        Preview
      </ActionButton>
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
    padding: 9px 10px 12px 10px;
    position: relative;
    transition: width 360ms ease-out;
  }
  .drawer-container {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    top: 0;
    left: 0;
  }
  .header {
    display: flex;
    margin: 0 6px 4px 0;
  }

  .header-left {
    display: flex;
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
    gap: var(--spacing-l);
  }
  .content {
    flex: 1 1 auto;
  }
  .actions {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
  }
</style>
