<script lang="ts">
  import AppPreview from "./AppPreview.svelte"
  import {
    screenStore,
    appStore,
    selectedScreen,
    previewStore,
    selectedAppUrls,
    workspaceAppStore,
  } from "@/stores/builder"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import ScreenErrorsButton from "./ScreenErrorsButton.svelte"
  import { ActionButton, Divider, Toggle, AbsTooltip } from "@budibase/bbui"
  import { PublishResourceState, ScreenVariant } from "@budibase/types"
  import ThemeSettings from "./Theme/ThemeSettings.svelte"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"

  let changingStatus = false

  $: mobile = $previewStore.previewDevice === "mobile"
  $: isPDF = $selectedScreen?.variant === ScreenVariant.PDF
  $: selectedWorkspaceApp = $workspaceAppStore.selectedWorkspaceApp

  $: liveUrl = $selectedAppUrls.liveUrl

  $: toggleValue =
    selectedWorkspaceApp?.publishStatus.state === PublishResourceState.PUBLISHED

  const previewApp = () => {
    previewStore.showPreview(true)
  }

  const togglePreviewDevice = () => {
    previewStore.setDevice(mobile ? "desktop" : "mobile")
  }

  const handleToggleChange = async (e: CustomEvent<boolean>) => {
    if (!selectedWorkspaceApp) {
      return
    }

    try {
      changingStatus = true

      await workspaceAppStore.toggleDisabled(
        selectedWorkspaceApp._id!,
        !e.detail
      )
    } finally {
      changingStatus = false
    }
  }
</script>

{#if selectedWorkspaceApp}
  <div class="app-panel">
    <div class="drawer-container" />
    <div class="header">
      <div class="header-left">
        <div class="workspace-info">
          {#if selectedWorkspaceApp.publishStatus.state === PublishResourceState.PUBLISHED}
            <div class="workspace-url">
              <AbsTooltip text="Open live app">
                <ActionButton
                  icon="globe-simple"
                  quiet
                  on:click={() => {
                    window.open(liveUrl, "_blank")
                  }}
                />
              </AbsTooltip>
            </div>
          {/if}
        </div>
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
        <div class="divider-container">
          <Divider size="S" vertical />
        </div>
        <div class="workspace-info-toggle">
          <PublishStatusBadge
            status={selectedWorkspaceApp.publishStatus.state}
            loading={changingStatus}
          />
          <Toggle
            noPadding
            on:change={handleToggleChange}
            value={toggleValue}
            disabled={changingStatus}
          />
        </div>
      </div>
    </div>
    <div class="content">
      {#key $appStore.version}
        <AppPreview />
      {/key}
    </div>
  </div>
{/if}

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
    gap: 6px;
  }

  .workspace-info-toggle {
    display: flex;
    align-items: center;
    justify-content: right;
    gap: var(--spacing-m);
    width: 100px;
  }

  .workspace-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .workspace-url {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
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
