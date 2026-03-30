<script lang="ts">
  import { Badge, Body, Heading } from "@budibase/bbui"
  import type { AgentEvalCaseResult } from "@budibase/types"
  import { getResultStatus, resultSummary, statusToBadgeProps } from "./utils"

  type Props = {
    results: AgentEvalCaseResult[]
    selectedCaseId: string | null
    onSelectCase: (_caseId: string) => void
  }

  let { results, selectedCaseId, onSelectCase }: Props = $props()
</script>

<div class="case-list">
  <div class="section-header">
    <Heading size="XS">Cases in run</Heading>
  </div>

  {#if results.length > 0}
    <div class="case-items">
      {#each results as result (result.caseId)}
        {@const status = getResultStatus(result)}
        {@const badgeProps = statusToBadgeProps(status)}
        <button
          class:selected={result.caseId === selectedCaseId}
          class="case-item"
          type="button"
          onclick={() => onSelectCase(result.caseId)}
        >
          <div class="case-item-top">
            <span class="case-item-name">{result.name}</span>
            <Badge {...badgeProps} size="S">{resultSummary(result)}</Badge>
          </div>
          <div class="case-item-subtitle">
            {result.caseSnapshot.input || "No input"}
          </div>
        </button>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Select a suite run to inspect its cases.
      </Body>
    </div>
  {/if}
</div>

<style>
  .case-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    min-height: 0;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .case-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    min-height: 0;
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
    padding: var(--spacing-xs) 0;
  }
</style>
