<script lang="ts">
  import { ActionButton, Body, Icon } from "@budibase/bbui"
  import type { AgentEvalCase } from "@budibase/types"
  import EvalCaseConfig from "./EvalCaseConfig.svelte"

  type Props = {
    selectedCase: AgentEvalCase | null
    toolOptions: { label: string; value: string }[]
    onUpdateCase: (
      _updater: (_testCase: AgentEvalCase) => AgentEvalCase
    ) => void
    onDuplicateCase: () => void
    onRemoveCase: () => void
  }

  let {
    selectedCase,
    toolOptions,
    onUpdateCase,
    onDuplicateCase,
    onRemoveCase,
  }: Props = $props()
</script>

{#if selectedCase}
  <div class="detail-content">
    <div class="detail-header">
      <div class="detail-heading">
        <h3 class="detail-title">{selectedCase.name}</h3>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Edit the input and reviewer checks for this case.
        </Body>
      </div>
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

    <EvalCaseConfig {selectedCase} {toolOptions} {onUpdateCase} />
  </div>
{:else}
  <div class="detail-empty">
    <Icon name="clock" size="L" color="var(--spectrum-global-color-gray-500)" />
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Select a case to edit its configuration
    </Body>
  </div>
{/if}

<style>
  .detail-content {
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  .detail-heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
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
