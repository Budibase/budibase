<script lang="ts">
  import { ActionButton, Badge, Body, Button, Heading } from "@budibase/bbui"
  import type { AgentEvalCase, AgentEvalCaseResult } from "@budibase/types"
  import { getResultStatus, resultSummary, statusToBadgeProps } from "./utils"

  type Props = {
    cases: AgentEvalCase[]
    resultsByCaseId: Map<string, AgentEvalCaseResult>
    hasLatestRun: boolean
    selectedCaseId: string | null
    loading: boolean
    onSelectCase: (_caseId: string) => void
    onAddCase: () => void
  }

  let {
    cases,
    resultsByCaseId,
    hasLatestRun,
    selectedCaseId,
    loading,
    onSelectCase,
    onAddCase,
  }: Props = $props()

  const getCaseResultLabel = (result?: AgentEvalCaseResult) => {
    if (result) {
      return resultSummary(result)
    }

    if (hasLatestRun) {
      return "Not in latest run"
    }

    return "No runs yet"
  }
</script>

<div class="case-list-header">
  <div class="case-list-heading">
    <Heading size="XS">Cases</Heading>
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      {#if hasLatestRun}
        Status from the latest suite run
      {:else}
        Add cases, then run the suite to generate results
      {/if}
    </Body>
  </div>
  <ActionButton quiet icon="plus" on:click={onAddCase}>Add case</ActionButton>
</div>

<div class="case-list-body">
  {#if loading && !cases.length}
    <div class="empty-state">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Loading evaluation suite...
      </Body>
    </div>
  {:else if !cases.length}
    <div class="empty-state">
      <div class="empty-state-content">
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          No evaluation cases yet.
        </Body>
        <Button secondary on:click={onAddCase}>Add first case</Button>
      </div>
    </div>
  {:else}
    <div class="case-items">
      {#each cases as testCase (testCase.id)}
        {@const result = resultsByCaseId.get(testCase.id)}
        {@const status = getResultStatus(result)}
        {@const badgeProps = statusToBadgeProps(status)}
        <button
          class:selected={testCase.id === selectedCaseId}
          class="case-item"
          type="button"
          onclick={() => onSelectCase(testCase.id)}
        >
          <div class="case-item-top">
            <span class="case-item-name">{testCase.name}</span>
            <Badge {...badgeProps} size="S">{getCaseResultLabel(result)}</Badge>
          </div>
          <div class="case-item-subtitle">
            {testCase.input || "No input yet"}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .case-list-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding: var(--spacing-l) var(--spacing-l) var(--spacing-s);
    flex-shrink: 0;
  }

  .case-list-heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .case-list-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 0 var(--spacing-l) var(--spacing-l);
    scrollbar-width: thin;
  }

  .case-list-body::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .case-list-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .case-list-body::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .case-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .case-item {
    width: 100%;
    text-align: left;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    padding: var(--spacing-s);
    background: var(--background);
    cursor: pointer;
    transition:
      border-color 130ms ease,
      background 130ms ease;
  }

  .case-item:hover {
    border-color: var(--spectrum-global-color-gray-400);
    background: var(--background-alt);
  }

  .case-item.selected {
    border-color: var(--bb-blue);
    background: var(--background-alt);
  }

  .case-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-xs);
  }

  .case-item-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .case-item-subtitle {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px var(--spacing-m);
    text-align: center;
  }

  .empty-state-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
