<script>
  import { Body, Icon, ActionButton, Divider } from "@budibase/bbui"
  import Panel from "@/components/design/Panel.svelte"
  import JSONViewer from "@/components/common/JSONViewer.svelte"
  import { fly } from "svelte/transition"
  import dayjs from "dayjs"
  import StatusRenderer from "@/pages/builder/app/[application]/settings/automations/_components/StatusRenderer.svelte"

  export let log
  export let selectedStep = null
  export let onBack = () => {}

  let selectedTab = "Data in"
  const tabs = ["Data in", "Data out", "Issues"]

  $: logDate = log ? dayjs(log.createdAt).format("MMM DD, YYYY HH:mm:ss") : ""
  $: currentStepData = getCurrentStepData(selectedStep)

  function getCurrentStepData(step) {
    if (!step) return null

    return {
      inputs: step.inputs || {},
      outputs: step.outputs || {},
      errors: getStepErrors(step),
    }
  }
  function getStepErrors(step) {
    if (!step || step.outputs?.success !== false) return []

    return [
      {
        message: step.outputs?.message || "Step failed",
        type: "error",
      },
    ]
  }
</script>

<div class="container" transition:fly|local={{ x: 260, duration: 300 }}>
  <Panel customWidth={400} borderLeft>
    <div slot="panel-title-content" class="log-header-container">
      <div class="log-header-left">
        <Icon name="ChevronLeft" hoverable on:click={onBack} />
        <div class="log-title-section">
          <div class="log-title">
            <Body size="S" textAlign="left">
              {log?.automationName || "Automation"} log
            </Body>
          </div>
          <div class="log-metadata">
            <Body
              size="XS"
              textAlign="left"
              color="var(--spectrum-global-color-gray-600)"
            >
              {logDate}
            </Body>
          </div>
        </div>
      </div>
      <div class="log-status">
        <StatusRenderer value={log.status} />
      </div>
    </div>

    {#if selectedStep}
      <div class="panel-content">
        <div class="tabs">
          {#each tabs as tab}
            <ActionButton
              selected={tab === selectedTab}
              quiet
              on:click={() => (selectedTab = tab)}
            >
              {tab}
              {#if tab === "Issues" && currentStepData?.errors?.length > 0}
                <span class="error-count"
                  >({currentStepData.errors.length})</span
                >
              {/if}
            </ActionButton>
          {/each}
        </div>
        <Divider noMargin />

        <div class="step-data-viewer">
          {#if selectedTab === "Data in"}
            <JSONViewer value={currentStepData?.inputs} />
          {:else if selectedTab === "Data out"}
            <JSONViewer value={currentStepData?.outputs} />
          {:else if selectedTab === "Issues"}
            <div class="issues-panel">
              {#if currentStepData?.errors?.length > 0}
                {#each currentStepData.errors as error}
                  <div class="issue error">
                    <Icon name="Alert" />
                    <span>{error.message}</span>
                  </div>
                {/each}
              {:else}
                <div class="no-issues">
                  <Body size="S" textAlign="center">No issues found</Body>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="no-step-selected">
        <Body size="S" textAlign="center">
          Select a step in the automation flow to view its data
        </Body>
      </div>
    {/if}
  </Panel>
</div>

<style>
  .container {
    position: fixed;
    right: 0;
    z-index: 99;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .log-header-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    flex: 1;
    min-width: 0;
    padding: var(--spacing-xs) 0;
  }

  .log-header-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-s);
    flex: 1;
    min-width: 0;
  }

  .log-title-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
    min-width: 0;
  }

  .log-title {
    display: flex;
    align-items: center;
  }

  .log-metadata {
    display: flex;
    align-items: center;
    opacity: 0.8;
  }

  .log-status {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .panel-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .no-step-selected {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    padding: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
  }

  .tabs {
    display: flex;
    gap: var(--spacing-s);
    padding: var(--spacing-m) var(--spacing-l);
    flex-shrink: 0;
  }

  .step-data-viewer {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-l);
  }

  .issues-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .issue {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    border-radius: 4px;
    background: var(--spectrum-semantic-negative-color-background);
    border: 1px solid var(--spectrum-semantic-negative-color-border);
    color: var(--spectrum-semantic-negative-color-text);
  }

  .no-issues {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: var(--spectrum-global-color-gray-600);
  }

  .error-count {
    margin-left: var(--spacing-xs);
    font-size: 0.8em;
    opacity: 0.8;
  }
</style>
