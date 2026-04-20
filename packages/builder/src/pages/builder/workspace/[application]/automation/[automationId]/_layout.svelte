<script>
  import { onDestroy } from "svelte"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import {
    builderStore,
    automationStore,
    selectedAutomation,
  } from "@/stores/builder"
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import StepPanel from "@/components/automation/AutomationBuilder/StepPanel.svelte"
  import SelectStepSidePanel from "@/components/automation/AutomationBuilder/FlowChart/SelectStepSidePanel.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import LogDetailsPanel from "@/components/automation/AutomationBuilder/FlowChart/LogDetailsPanel.svelte"
  import AutomationLogsPanel from "@/components/automation/AutomationBuilder/FlowChart/AutomationLogsPanel.svelte"

  const { goto, params, url, redirect, isActive, page, layout } = routify
  $goto
  $params
  $url
  $redirect
  $isActive
  $page
  $layout

  $: automationId = $selectedAutomation?.data?._id
  $: blockRefs = $selectedAutomation.blockRefs
  $: builderStore.selectResource(automationId)

  const stopSyncing = syncURLToState({
    urlParam: "automationId",
    stateKey: "selectedAutomationId",
    validate: id => $automationStore.automations.some(x => x._id === id),
    fallbackUrl: "../index",
    store: automationStore,
    update: automationStore.actions.select,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<div class="wrapper" class:resizing-panel={$builderStore.isResizingPanel}>
  <TopBar
    breadcrumbs={[
      { text: "Automations", url: "../" },
      { text: $selectedAutomation?.data?.name },
    ]}
    icon="path"
  />
  <div class="root">
    <div class="content drawer-container">
      <slot />
    </div>

    {#if blockRefs[$automationStore.selectedNodeId] && $automationStore.selectedNodeId}
      <div class="step-panel-container">
        <ResizablePanel
          storageKey="automation-side-panel-width"
          defaultWidth={480}
          minWidth={360}
          maxWidthRatio={0.6}
          position="right"
        >
          <div class="step-panel">
            <StepPanel />
          </div>
        </ResizablePanel>
      </div>
    {/if}

    {#if $automationStore.actionPanelBlock && !$automationStore.selectedNodeId}
      <SelectStepSidePanel
        block={$automationStore.actionPanelBlock}
        onClose={() => automationStore.actions.closeActionPanel()}
      />
    {/if}

    {#if $automationStore.showLogsPanel && $selectedAutomation?.data}
      <div class="logs-panel-container">
        <div class="panels-wrapper">
          <div class="logs-panel">
            <AutomationLogsPanel
              automation={$selectedAutomation.data}
              onSelectLog={log =>
                automationStore.actions.selectLogForDetails(log)}
              selectedLog={$automationStore.selectedLog}
            />
          </div>

          {#if $automationStore.showLogDetailsPanel && $automationStore.selectedLog}
            <div class="log-details-panel">
              <LogDetailsPanel
                log={$automationStore.selectedLog}
                selectedStep={$automationStore.selectedLogStepData}
                onBack={() => automationStore.actions.closeLogPanel()}
              />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
  }
  .root {
    flex: 1 1 auto;
    display: grid;
    grid-auto-flow: column dense;
    grid-template-columns: minmax(510px, 1fr) fit-content(500px);
    overflow: hidden;
  }
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    overflow: auto;
  }
  .step-panel-container {
    position: fixed;
    right: 0;
    z-index: 99;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  .step-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--background);
    overflow: auto;
    flex: 1 1 auto;
    min-width: 0;
  }

  .logs-panel-container {
    position: relative;
    width: 400px;
    max-width: 400px;
    overflow: hidden;
    height: 100%;
    border-left: var(--border-light);
  }

  .panels-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .logs-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--background);
    overflow: auto;
    transition: transform 0.2s ease;
  }

  .log-details-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--background);
    overflow: auto;
  }
  .wrapper.resizing-panel {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>
