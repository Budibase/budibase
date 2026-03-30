<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import type { AgentEvalCase } from "@budibase/types"
  import EvalCaseConfig from "./EvalCaseConfig.svelte"
  import DetailPane from "./DetailPane.svelte"

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

<DetailPane
  title={selectedCase?.name ?? ""}
  subtitle="Edit the input and reviewer checks for this case."
  emptyText="Select a case to edit its configuration"
  isEmpty={!selectedCase}
>
  {#snippet actions()}
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
  {/snippet}

  {#if selectedCase}
    <EvalCaseConfig {selectedCase} {toolOptions} {onUpdateCase} />
  {/if}
</DetailPane>

<style>
  .editor-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex-shrink: 0;
  }
</style>
