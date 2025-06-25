<script>
  import { Body, Icon, ActionButton, Divider } from "@budibase/bbui"
  import Panel from "@/components/design/Panel.svelte"
  import JSONViewer from "@/components/common/JSONViewer.svelte"
  import dayjs from "dayjs"
  import StatusRenderer from "@/pages/builder/app/[application]/settings/automations/_components/StatusRenderer.svelte"

  export let log
  export let selectedStep = null
  export let onBack = () => {}

  let selectedTab = isBranchStep ? "Branch Info" : "Data in"

  $: hasInputData =
    currentStepData?.inputs && Object.keys(currentStepData.inputs).length > 0
  $: isBranchStep = selectedStep?.stepId === "BRANCH"
  $: availableTabs = isBranchStep
    ? ["Branch Info"]
    : ["Data in", "Data out", "Issues"]

  $: logDate = log ? dayjs(log.createdAt).format("MMM DD, YYYY HH:mm:ss") : ""
  $: currentStepData = getCurrentStepData(selectedStep)
  $: branchDetails = getBranchConditionDetails(selectedStep)
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

  function getBranchConditionDetails(step) {
    if (!step || step.stepId !== "BRANCH") return null

    const executedBranchId = step.outputs?.branchId
    const executedBranchName = step.outputs?.branchName
    const branches = step.inputs?.branches || []

    const executedBranch = branches.find(
      branch => branch.id === executedBranchId
    )

    return {
      executedBranchId,
      executedBranchName,
      executedBranch,
      allBranches: branches,
      totalBranches: branches.length,
    }
  }
</script>

<div class="container">
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
          {#each availableTabs as tab}
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
            {#if !hasInputData}
              <div class="no-data-message">
                <Body size="S" textAlign="center">No inputs available</Body>
              </div>
            {:else}
              <JSONViewer value={currentStepData?.inputs} />
            {/if}
          {:else if selectedTab === "Data out"}
            <JSONViewer value={currentStepData?.outputs} />
          {:else if selectedTab === "Branch Info"}
            {#if branchDetails}
              <div class="branch-info">
                <div class="branch-summary">
                  <Body size="S" weight="600">Branch Taken:</Body>
                  <Body size="S">{branchDetails.executedBranchName}</Body>
                </div>

                <div class="branch-conditions">
                  <Body size="S" weight="600">Why this branch was chosen:</Body>
                  {#if branchDetails.executedBranch?.condition}
                    <div class="condition-details">
                      <JSONViewer
                        value={branchDetails.executedBranch.condition}
                      />
                    </div>
                  {/if}

                  {#if branchDetails.executedBranch?.conditionUI}
                    <div class="human-readable-condition">
                      <Body size="S" weight="600">Condition Summary:</Body>
                      <div class="condition-summary">
                        {#if branchDetails.executedBranch.conditionUI.groups}
                          {#each branchDetails.executedBranch.conditionUI.groups as group, groupIndex}
                            <div class="condition-group">
                              {#if groupIndex > 0}
                                <span class="operator"
                                  >{branchDetails.executedBranch.conditionUI
                                    .logicalOperator === "all"
                                    ? "AND"
                                    : "OR"}</span
                                >
                              {/if}
                              {#each group.filters as filter, filterIndex}
                                {#if filterIndex > 0}
                                  <span class="operator"
                                    >{group.logicalOperator === "all"
                                      ? "AND"
                                      : "OR"}</span
                                  >
                                {/if}
                                <div class="condition-item">
                                  <code>{filter.field}</code>
                                  <span class="operator-text"
                                    >{filter.operator}</span
                                  >
                                  <code>{filter.value}</code>
                                </div>
                              {/each}
                            </div>
                          {/each}
                        {/if}
                      </div>
                    </div>
                  {/if}
                </div>

                {#if branchDetails.totalBranches > 1}
                  <div class="other-branches">
                    <Body size="S" weight="600">Other available branches:</Body>
                    {#each branchDetails.allBranches as branch}
                      {#if branch.id !== branchDetails.executedBranchId}
                        <div class="branch-item">
                          <Body size="S">{branch.name}</Body>
                        </div>
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
            {:else}
              <div class="no-data-message">
                <Body size="S" textAlign="center"
                  >No branch information available</Body
                >
              </div>
            {/if}
          {:else if selectedTab === "Issues"}
            <div class="issues" class:empty={!currentStepData?.errors?.length}>
              {#if currentStepData?.errors?.length === 0}
                <span>There are no current issues</span>
              {:else}
                {#each currentStepData.errors as error}
                  <div class="issue error">
                    <div class="icon"><Icon name="Alert" /></div>
                    <div class="message">
                      {error.message || "There was an error"}
                    </div>
                  </div>
                  <Divider noMargin />
                {/each}
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

  .no-data-message {
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

  .issue {
    display: flex;
    gap: var(--spacing-s);
    width: 100%;
    box-sizing: border-box;
    padding-bottom: var(--spacing-l);
  }

  .issues {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    word-break: break-word;
  }

  .issues.empty {
    align-items: center;
    justify-content: center;
  }

  .issue.error .icon {
    color: var(--spectrum-global-color-static-red-600);
  }

  .issues :global(hr.spectrum-Divider:last-child) {
    display: none;
  }

  .issues .issue:not(:first-child) {
    padding-top: var(--spacing-l);
  }

  .error-count {
    margin-left: var(--spacing-xs);
    font-size: 0.8em;
    opacity: 0.8;
  }

  .branch-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .branch-summary {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-m);
    background: var(--spectrum-global-color-gray-75);
    border-radius: var(--border-radius-s);
  }

  .branch-conditions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .condition-details {
    margin-top: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    overflow: hidden;
  }

  .human-readable-condition {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .condition-summary {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    background: var(--spectrum-global-color-gray-50);
    border-radius: var(--border-radius-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }

  .condition-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .condition-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-xs) var(--spacing-s);
    background: white;
    border-radius: var(--border-radius-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .condition-item code {
    background: var(--spectrum-global-color-gray-100);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.85em;
    color: var(--spectrum-global-color-gray-800);
  }

  .operator,
  .operator-text {
    font-weight: 600;
    color: var(--spectrum-global-color-blue-600);
    text-transform: uppercase;
    font-size: 0.8em;
  }

  .other-branches {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .branch-item {
    padding: var(--spacing-s);
    background: var(--spectrum-global-color-gray-50);
    border-radius: var(--border-radius-s);
    border-left: 3px solid var(--spectrum-global-color-gray-400);
  }
</style>
