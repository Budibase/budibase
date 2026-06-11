<script lang="ts">
  import type { AgentKnowledgeRetrievalDiagnostics } from "@budibase/types"
  import { formatDuration, formatNoResultReason } from "./utils"

  type Props = {
    diagnostics: AgentKnowledgeRetrievalDiagnostics
  }

  let { diagnostics }: Props = $props()
</script>

<div class="retrieval-summary">
  <div class="retrieval-row">
    <span class="retrieval-label">Query</span>
    <span class="retrieval-value">{diagnostics.query}</span>
  </div>
  <div class="retrieval-grid">
    <div class="retrieval-row">
      <span class="retrieval-label">Knowledge bases</span>
      <span class="retrieval-value">
        {diagnostics.knowledgeBaseCount}
      </span>
    </div>
    <div class="retrieval-row">
      <span class="retrieval-label">Files</span>
      <span class="retrieval-value">
        {diagnostics.readyFileCount} ready / {diagnostics.totalFileCount} total
      </span>
    </div>
    <div class="retrieval-row">
      <span class="retrieval-label">Skipped files</span>
      <span class="retrieval-value">
        {diagnostics.skippedFileCount}
      </span>
    </div>
    <div class="retrieval-row">
      <span class="retrieval-label">Chunks</span>
      <span class="retrieval-value">
        {diagnostics.acceptedChunkCount} accepted / {diagnostics.returnedChunkCount}
        returned
      </span>
    </div>
    <div class="retrieval-row">
      <span class="retrieval-label">Duration</span>
      <span class="retrieval-value">
        {formatDuration(diagnostics.durationMs)}
      </span>
    </div>
    {#if diagnostics.noResultReason}
      <div class="retrieval-row">
        <span class="retrieval-label">No result reason</span>
        <span class="retrieval-value">
          {formatNoResultReason(diagnostics.noResultReason)}
        </span>
      </div>
    {/if}
  </div>
  <div class="retrieval-row">
    <span class="retrieval-label">Sources</span>
    <span class="retrieval-value">
      {#if diagnostics.sources.length}
        {diagnostics.sources
          .map(source => source.filename || source.sourceId)
          .join(", ")}
      {:else}
        -
      {/if}
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
