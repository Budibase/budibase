<script>
  import { Detail, Body, Tabs, Tab, Icon, Button } from "@budibase/bbui"
  import FlowItemStatus from "./FlowItemStatus.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import JSONViewer from "@/components/common/JSONViewer.svelte"
  import { fly } from "svelte/transition"
  import dayjs from "dayjs"
  import StatusRenderer from "@/pages/builder/app/[application]/settings/automations/_components/StatusRenderer.svelte"
  export let log
  export let onClose = () => {}
  export let onBack = () => {}

  let selectedTab = "Data in"
  let selectedStep = null
  $: logDate = log ? dayjs(log.createdAt).format("MMM DD, YYYY HH:mm:ss") : ""
  $: triggerData = log?.trigger?.outputs || {}
  $: stepsData = log?.steps?.slice(1) || [] // Skip trigger step
  $: allOutputs = stepsData.reduce(
    (acc, step, idx) => {
      acc[`Step ${idx + 1} (${step.stepId})`] = step.outputs
      return acc
    },
    { Trigger: triggerData }
  )

  $: allInputs = stepsData.reduce(
    (acc, step, idx) => {
      acc[`Step ${idx + 1} (${step.stepId})`] = step.inputs
      return acc
    },
    { Trigger: log?.trigger?.inputs || {} }
  )

  $: errors = getErrors()

  function getErrors() {
    if (!log) return []

    const errorList = []

    // Check trigger errors
    if (log.trigger?.outputs?.success === false) {
      errorList.push({
        step: "Trigger",
        stepId: log.trigger.stepId,
        message: log.trigger.outputs?.message || "Trigger failed",
        outputs: log.trigger.outputs,
      })
    }

    // Check step errors
    stepsData?.forEach((step, idx) => {
      if (step.outputs?.success === false) {
        errorList.push({
          step: `Step ${idx + 1}`,
          stepId: step.stepId,
          message: step.outputs?.message || "Step failed",
          outputs: step.outputs,
        })
      }
    })

    return errorList
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" transition:fly|local={{ x: 260, duration: 300 }}>
  <Panel titleCSS={false} customWidth={400} borderLeft>
    <div slot="panel-title-content">
      <div class="log-header-container">
        <div class="log-title">
          <Icon name="ChevronLeft" size="S" on:click={onBack} />
          <Body size="S" textAlign="left">
            {log?.automationName || "Automation"} log
          </Body>
        </div>
        <div class="log-title">
          <Body size="S" textAlign="left">
            {logDate}
          </Body>
        </div>
      </div>
    </div>

    <div class="steps-breakdown">
      {#if log?.steps && log.steps.length > 0}
        {#each log.steps as step, stepIdx}
          <div class="step-item" on:click={() => (selectedStep = step)}>
            <div class="step-content">
              <div class="step-info">
                <div class="step-icon">
                  <!-- Placeholder icon -->
                  <div class="icon-placeholder"></div>
                </div>
                <div class="step-details">
                  <Detail size="S" weight="600">
                    {stepIdx === 0 ? "TRIGGER" : `STEP ${stepIdx}`} ({step.stepId?.toUpperCase() ||
                      "UNKNOWN"})
                  </Detail>
                  <Body size="XS">{step.name || "Unknown Step"}</Body>
                  <Body size="XS"
                    >{Object.keys(step.outputs || {}).length} keys</Body
                  >
                </div>
              </div>
              <div class="step-status">
                <StatusRenderer value={step.status} />
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <Body size="S" textAlign="center">No steps available</Body>
      {/if}
    </div>
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
    gap: var(--spacing-s);
  }

  .log-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-s);
  }

  .steps-breakdown {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
  }

  .step-item {
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-global-color-gray-100);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .step-item:hover {
    background: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-gray-400);
  }

  .step-content {
    padding: var(--spacing-m);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .step-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    flex: 1;
  }

  .step-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--spectrum-global-color-gray-300);
    border-radius: 4px;
  }

  .icon-placeholder {
    width: 16px;
    height: 16px;
    background: var(--spectrum-global-color-gray-500);
    border-radius: 2px;
  }

  .step-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .step-details :global(.spectrum-Detail) {
    color: var(--spectrum-global-color-gray-800);
  }

  .step-details :global(.spectrum-Body) {
    color: var(--spectrum-global-color-gray-600);
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status-badge.success {
    background: var(--spectrum-semantic-positive-color-background);
    border: 1px solid var(--spectrum-semantic-positive-color-border);
  }

  .status-badge.success :global(.spectrum-Detail) {
    color: var(--spectrum-semantic-positive-color-text);
  }

  .status-badge.error {
    background: var(--spectrum-semantic-negative-color-background);
    border: 1px solid var(--spectrum-semantic-negative-color-border);
  }

  .status-badge.error :global(.spectrum-Detail) {
    color: var(--spectrum-semantic-negative-color-text);
  }
</style>
