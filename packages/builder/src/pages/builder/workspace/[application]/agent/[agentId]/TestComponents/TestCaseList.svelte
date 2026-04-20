<script lang="ts">
  import { Body, Button } from "@budibase/bbui"
  import type { AgentTestCase } from "@budibase/types"

  type Props = {
    cases: AgentTestCase[]
    selectedCaseId: string | null
    loading: boolean
    onSelectCase: (_caseId: string) => void
    onAddCase: () => void
  }

  let { cases, selectedCaseId, loading, onSelectCase, onAddCase }: Props =
    $props()
</script>

{#if cases.length > 0}
  <div class="case-list-header">
    <Button secondary icon="plus" size="M" on:click={onAddCase}>
      Add test
    </Button>
  </div>
{/if}

<div class="case-list-body">
  {#if loading && !cases.length}
    <div class="empty-state">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Loading tests...
      </Body>
    </div>
  {:else if !cases.length}
    <div class="empty-state">
      <div class="empty-state-content">
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          No tests yet.
        </Body>
        <Button secondary on:click={onAddCase}>Add first test</Button>
      </div>
    </div>
  {:else}
    <div class="case-items">
      {#each cases as testCase (testCase.id)}
        <button
          class:selected={testCase.id === selectedCaseId}
          class="case-item"
          type="button"
          onclick={() => onSelectCase(testCase.id)}
        >
          <span class="case-item-name">{testCase.name}</span>
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
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    align-self: stretch;
    width: 100%;
    max-width: 100%;
    gap: var(--spacing-m);
    padding: var(--spacing-l) var(--spacing-l) var(--spacing-s);
    flex-shrink: 0;
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
    background: var(--background-alt);
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
