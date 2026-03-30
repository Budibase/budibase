<script lang="ts">
  import {
    ActionButton,
    Body,
    Icon,
    Tab,
    Tabs,
  } from "@budibase/bbui"
  import type {
    AgentEvalCase,
    AgentEvalCaseResult,
    AgentEvalRun,
  } from "@budibase/types"
  import EvalCaseOverview from "./EvalCaseOverview.svelte"
  import EvalCaseConfig from "./EvalCaseConfig.svelte"
  import EvalCaseResults from "./EvalCaseResults.svelte"

  type Props = {
    selectedCase: AgentEvalCase | null
    selectedResult: AgentEvalCaseResult | null
    selectedRun: AgentEvalRun | null
    recentRuns: AgentEvalRun[]
    selectedRunId: string | null
    onUpdateCase: (
      updater: (testCase: AgentEvalCase) => AgentEvalCase
    ) => void
    onDuplicateCase: () => void
    onRemoveCase: () => void
    onSelectRun: (runId: string) => void
  }

  let {
    selectedCase,
    selectedResult,
    selectedRun,
    recentRuns,
    selectedRunId,
    onUpdateCase,
    onDuplicateCase,
    onRemoveCase,
    onSelectRun,
  }: Props = $props()

  let selectedTab = $state("Overview")
</script>

{#if selectedCase}
  <div class="detail-content">
    <div class="detail-header">
      <h3 class="detail-title">{selectedCase.name}</h3>
      <div class="editor-actions">
        <ActionButton
          quiet
          icon="copy"
          tooltip="Duplicate"
          on:click={onDuplicateCase}
        />
        <ActionButton
          quiet
          icon="trash"
          tooltip="Delete"
          on:click={onRemoveCase}
        />
      </div>
    </div>

    <Tabs bind:selected={selectedTab} noPadding size="M">
      <Tab title="Overview">
        <EvalCaseOverview {selectedCase} {selectedResult} {selectedRun} />
      </Tab>
      <Tab title="Configuration">
        <EvalCaseConfig {selectedCase} {onUpdateCase} />
      </Tab>
      <Tab title="Results">
        <EvalCaseResults
          {selectedResult}
          {recentRuns}
          {selectedRunId}
          {onSelectRun}
        />
      </Tab>
    </Tabs>
  </div>
{:else}
  <div class="detail-empty">
    <Icon
      name="clock"
      size="L"
      color="var(--spectrum-global-color-gray-500)"
    />
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Select a case to view and edit
    </Body>
  </div>
{/if}

<style>
  .detail-content {
    padding: var(--spacing-xl) var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .detail-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .editor-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex-shrink: 0;
  }

  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
    min-height: 200px;
  }
</style>
