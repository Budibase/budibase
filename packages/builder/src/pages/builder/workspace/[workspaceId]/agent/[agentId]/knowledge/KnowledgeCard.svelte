<script lang="ts">
  import {
    getKnowledgeFileDisplayType,
    KnowledgeBaseFileStatus,
  } from "@budibase/types"
  import KnowledgeIconRenderer from "./renderers/KnowledgeIconRenderer.svelte"
  import KnowledgeStatusRenderer from "./renderers/KnowledgeStatusRenderer.svelte"
  import KnowledgeActionsRenderer from "./renderers/KnowledgeActionsRenderer.svelte"
  import type { KnowledgeTableRow } from "./renderers/types"

  export interface Props {
    row: KnowledgeTableRow
    showActions?: boolean
    onClick?: (row: KnowledgeTableRow) => void
  }

  let { row, showActions = true, onClick }: Props = $props()

  let clickable = $derived(!!onClick && !!row.__clickable)

  let meta = $derived.by(() => {
    if (row.kind === "sharepoint_connection") {
      return row.subtitle
    }
    const type = getKnowledgeFileDisplayType({
      filename: row.filename,
      mimetype: row.mimetype,
    })
    return row.size ? `${type} · ${row.size}` : type
  })

  let failed = $derived(
    row.kind === "sharepoint_connection"
      ? !!row.errorMessage
      : row.status === KnowledgeBaseFileStatus.FAILED
  )
  let errorMessage = $derived(
    failed ? row.errorMessage || "Failed to process file" : undefined
  )

  const handleClick = () => {
    if (clickable) {
      onClick?.(row)
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (clickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault()
      onClick?.(row)
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="knowledge-card"
  class:clickable
  class:failed
  role={clickable ? "button" : undefined}
  tabindex={clickable ? 0 : undefined}
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  <div class="card-header">
    <div class="card-icon">
      <KnowledgeIconRenderer {row} />
    </div>
    <span class="card-name">{row.filename}</span>
    {#if showActions}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="card-actions" onclick={event => event.stopPropagation()}>
        <KnowledgeActionsRenderer {row} />
      </div>
    {/if}
  </div>
  <div class="card-details">
    <KnowledgeStatusRenderer {row} />
    <span class="card-meta">{meta}</span>
  </div>
  {#if errorMessage}
    <div class="card-error">{errorMessage}</div>
  {/if}
</div>

<style>
  .knowledge-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-s) var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-m);
    background: var(--spectrum-global-color-gray-50);
  }

  .knowledge-card.failed {
    border-color: var(--spectrum-semantic-negative-color-default);
  }

  .knowledge-card.clickable {
    cursor: pointer;
  }

  .knowledge-card.clickable:hover {
    background: var(--spectrum-global-color-gray-100);
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-s);
  }

  .card-icon {
    display: flex;
    flex-shrink: 0;
    width: 20px;
    justify-content: center;
  }

  .card-name {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--spectrum-global-color-gray-900);
    overflow-wrap: anywhere;
  }

  .card-actions {
    display: flex;
    flex-shrink: 0;
    margin: -4px -4px -4px 0;
  }

  .card-details,
  .card-error {
    padding-left: calc(20px + var(--spacing-s));
  }

  .card-details {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-xs) var(--spacing-s);
  }

  .card-meta {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    overflow-wrap: anywhere;
  }

  .card-error {
    font-size: 12px;
    color: var(--spectrum-semantic-negative-color-default);
    overflow-wrap: anywhere;
  }
</style>
