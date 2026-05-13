<script>
  import { onDestroy, setContext } from "svelte"
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
  import BranchDeleteConfirmDialog from "@/components/automation/AutomationBuilder/BranchDeleteConfirmDialog.svelte"
  import { BRANCH_DELETE_DIALOG_CONTEXT } from "@/components/automation/AutomationBuilder/branchDeleteDialogContext"

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

  let branchDeleteConfirmDialog
  setContext(BRANCH_DELETE_DIALOG_CONTEXT, {
    show: selection => branchDeleteConfirmDialog?.show(selection),
  })

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

    {#if (blockRefs[$automationStore.selectedNodeId] || $automationStore.selectedBranchNode) && $automationStore.selectedNodeId}
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

<BranchDeleteConfirmDialog bind:this={branchDeleteConfirmDialog} />

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    min-height: 0;
    --automation-step-icon-data-color: var(--spectrum-global-color-blue-100);
    --automation-step-icon-flow-logic-color: var(
      --spectrum-global-color-indigo-100
    );
    --automation-step-icon-code-color: var(--spectrum-global-color-orange-100);
    --automation-step-icon-trigger-color: var(--color-green-200);
    --automation-step-icon-email-color: var(--spectrum-global-color-green-100);
    --automation-step-icon-ai-color: var(--spectrum-global-color-blue-100);
    --automation-step-icon-apps-color: var(--spectrum-global-color-orange-100);
  }
  :global(.spectrum--dark) .wrapper,
  :global(.spectrum--darkest) .wrapper,
  :global(.spectrum--midnight) .wrapper,
  :global(.spectrum--nord) .wrapper {
    --automation-step-icon-data-color: var(--color-blue-600);
    --automation-step-icon-flow-logic-color: var(--color-purple-600);
    --automation-step-icon-code-color: var(--color-orange-600);
    --automation-step-icon-trigger-color: var(--color-green-600);
    --automation-step-icon-email-color: var(--color-green-600);
    --automation-step-icon-ai-color: var(--color-brand-500);
    --automation-step-icon-apps-color: var(--color-orange-400);
  }
  .root {
    flex: 1 1 auto;
    display: grid;
    grid-auto-flow: column dense;
    grid-template-columns: minmax(510px, 1fr) fit-content(500px);
    overflow: hidden;
    min-height: 0;
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
    position: relative;
    z-index: 99;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    overflow: hidden;
  }
  .step-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--background);
    overflow: hidden;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    height: 100%;
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
