<script lang="ts">
  import type { AgentKnowledgeRetrievalDiagnostics } from "@budibase/types"
  import { buildKnowledgeRetrievalSummary } from "./utils"

  type Props = {
    diagnostics: AgentKnowledgeRetrievalDiagnostics
  }

  let { diagnostics }: Props = $props()
  let summary = $derived(buildKnowledgeRetrievalSummary(diagnostics))
</script>

<div class="retrieval-summary">
  <div class="retrieval-row">
    <span class="retrieval-label">Query</span>
    <span class="retrieval-value">{summary.query}</span>
  </div>
  <div class="retrieval-grid">
    {#each summary.statRows as row}
      <div class="retrieval-row">
        <span class="retrieval-label">{row.label}</span>
        <span class="retrieval-value">
          {row.value}
        </span>
      </div>
    {/each}
  </div>
  <div class="retrieval-row">
    <span class="retrieval-label">Sources</span>
    <span class="retrieval-value">
      {summary.sourcesLabel}
    </span>
  </div>
</div>

<style>
  .retrieval-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--background);
    padding: 10px;
  }

  .retrieval-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
  }

  .retrieval-row {
    display: grid;
    grid-template-columns: 112px minmax(0, 1fr);
    gap: 8px;
    align-items: baseline;
    min-width: 0;
    font-size: 12px;
  }

  .retrieval-label {
    color: var(--spectrum-global-color-gray-600);
    font-weight: 500;
  }

  .retrieval-value {
    color: var(--spectrum-global-color-gray-900);
    min-width: 0;
    word-break: break-word;
  }

  @media (max-width: 900px) {
    .retrieval-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
