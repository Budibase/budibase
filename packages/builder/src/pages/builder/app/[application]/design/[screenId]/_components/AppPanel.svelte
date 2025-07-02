<script lang="ts">
  import AppPreview from "./AppPreview.svelte"
  import {
    screenStore,
    appStore,
    selectedScreen,
    previewStore,
    selectedAppUrls,
    workspaceAppStore,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import ScreenErrorsButton from "./ScreenErrorsButton.svelte"
  import { ActionButton, Divider, Link } from "@budibase/bbui"
  import { ScreenVariant } from "@budibase/types"
  import ThemeSettings from "./Theme/ThemeSettings.svelte"

  $: mobile = $previewStore.previewDevice === "mobile"
  $: isPDF = $selectedScreen?.variant === ScreenVariant.PDF
  $: selectedWorkspaceAppId = $workspaceAppStore.selectedWorkspaceApp?._id

  $: isWorkspacePublished =
    selectedWorkspaceAppId &&
    $workspaceDeploymentStore.workspaceApps?.[selectedWorkspaceAppId]?.published

  $: liveUrl = $selectedAppUrls.liveUrl

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
      {#if $featureFlags.WORKSPACE_APPS && isWorkspacePublished}
        <Link href={liveUrl} target="_blank">{liveUrl}</Link>
      {/if}
    </div>
    <div class="header-right">
      <UndoRedoControl store={screenStore.history} />
      <div class="divider-container">
        <Divider size="S" vertical />
      </div>
      <div class="actions">
        {#if !isPDF}
          {#if $appStore.clientFeatures.devicePreview}
            <ActionButton
              quiet
              icon={mobile ? "device-mobile-camera" : "monitor"}
              on:click={togglePreviewDevice}
            />
          {/if}
          <ThemeSettings />
        {/if}
        <ScreenErrorsButton />
      </div>
      <div class="divider-container">
        <Divider size="S" vertical />
      </div>
      <ActionButton quiet icon="play" on:click={previewApp}>
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
    /* this container is just used for measurement, doesn't need to be seen */
    visibility: hidden;
  }
  .header {
    display: flex;
    margin: 0 6px 4px 0;
  }

  .header-left {
    display: flex;
    padding-left: var(--spacing-s);
    align-items: center;
  }

  .header-right {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
  .divider-container {
    display: flex;
    align-items: center;
    height: 18px;
  }
  .content {
    flex: 1 1 auto;
  }
  .actions {
    display: flex;
    flex-direction: row;
    gap: 2px;
    align-items: center;
  }
</style>
