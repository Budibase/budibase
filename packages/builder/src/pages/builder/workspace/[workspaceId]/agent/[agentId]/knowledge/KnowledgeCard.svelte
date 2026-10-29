<script lang="ts">
  import { AbsTooltip } from "@budibase/bbui"
  import KnowledgeTypeRenderer from "./renderers/KnowledgeTypeRenderer.svelte"
  import KnowledgeStatusRenderer from "./renderers/KnowledgeStatusRenderer.svelte"
  import type { KnowledgeTableRow } from "./renderers/types"

  export interface Props {
    row: KnowledgeTableRow
    onClick?: (row: KnowledgeTableRow) => void
  }

  let { row, onClick }: Props = $props()
</script>

<button class="knowledge-card" onclick={() => onClick?.(row)}>
  <AbsTooltip text={row.filename} unclamped>
    <span class="card-name">{row.filename}</span>
  </AbsTooltip>
  <span class="card-details">
    <KnowledgeTypeRenderer {row} />
    <KnowledgeStatusRenderer {row} />
  </span>
</button>

<style>
  .knowledge-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
    width: 100%;
    min-width: 0;
    min-height: 50px;
    padding: 8px 12px;
    border: 0;
    border-radius: 4px;
    background: var(--background-alt);
    color: inherit;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
  }

  .knowledge-card:hover {
    background: var(--spectrum-global-color-gray-100);
  }

  .card-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    line-height: 17px;
  }

  .card-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-xs) var(--spacing-s);
  }
</style>
