<script>
  import { Body, Icon, ActionButton, Divider } from "@budibase/bbui"
  import Panel from "@/components/design/Panel.svelte"
  import JSONViewer from "@/components/common/JSONViewer.svelte"
  import dayjs from "dayjs"
  import StatusRenderer from "@/pages/builder/app/[application]/settings/automations/_components/StatusRenderer.svelte"
  import {
    summariseBranch,
    getCurrentStepData,
    getBranchConditionDetails,
  } from "./AutomationStepHelpers"

  export let log
  export let selectedStep = null
  export let onBack = () => {}

  $: selectedTab = isBranchStep ? "Branch Info" : "Data in"

  $: hasInputData =
    currentStepData?.inputs && Object.keys(currentStepData.inputs).length > 0
  $: isBranchStep = selectedStep?.stepId === "BRANCH"
  $: availableTabs = isBranchStep
    ? ["Branch Info"]
    : ["Data in", "Data out", "Issues"]

  $: logDate = log ? dayjs(log.createdAt).format("MMM DD, YYYY HH:mm:ss") : ""
  $: currentStepData = getCurrentStepData(selectedStep)
  $: branchDetails = getBranchConditionDetails(selectedStep)

  let expandedBranches = new Set()

  function toggleBranch(id) {
    if (expandedBranches.has(id)) {
      expandedBranches.delete(id)
    } else {
      expandedBranches.add(id)
    }
    expandedBranches = new Set(expandedBranches)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
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
              <div class="branch-list">
                {#each branchDetails.allBranches as branch (branch.id)}
                  <div
                    class="branch-row {branch.id ===
                    branchDetails.executedBranchId
                      ? 'executed'
                      : 'skipped'}"
                    on:click={() => toggleBranch(branch.id)}
                  >
                    <div class="row-content">
                      <Body size="S"><strong>{branch.name}</strong></Body>
                      <Body
                        size="XS"
                        color="var(--spectrum-global-color-gray-600)"
                      >
                        {summariseBranch(branch)}
                      </Body>
                    </div>
                  </div>
                {/each}
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

  .branch-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .branch-row {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) 0;
    transition: background-color 130ms ease-in-out;
    border-bottom: var(--border-light);
  }

  .branch-row:hover {
    background-color: var(--spectrum-global-color-gray-200);
  }

  .branch-row.executed {
    border-left: 2px solid var(--spectrum-global-color-green-600);
    padding-left: var(--spacing-m);
  }

  .branch-row.skipped {
    opacity: 0.6;
  }

  .row-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xs);
  }
</style>
