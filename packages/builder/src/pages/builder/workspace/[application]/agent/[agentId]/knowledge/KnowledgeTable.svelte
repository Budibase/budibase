<script lang="ts">
  import { Body, ProgressCircle, Table } from "@budibase/bbui"
  import KnowledgeIconRenderer from "./renderers/KnowledgeIconRenderer.svelte"
  import KnowledgeNameRenderer from "./renderers/KnowledgeNameRenderer.svelte"
  import KnowledgeStatusRenderer from "./renderers/KnowledgeStatusRenderer.svelte"
  import KnowledgeActionsRenderer from "./renderers/KnowledgeActionsRenderer.svelte"
  import type { KnowledgeTableRow } from "./renderers/types"

  export interface Props {
    loading: boolean
    rows: KnowledgeTableRow[]
    onRowClick?: (_row: KnowledgeTableRow) => void
  }

  let { loading, rows, onRowClick }: Props = $props()

  const customRenderers = [
    { column: "icon", component: KnowledgeIconRenderer },
    { column: "filename", component: KnowledgeNameRenderer },
    { column: "displayStatus", component: KnowledgeStatusRenderer },
    { column: "actions", component: KnowledgeActionsRenderer },
  ]

  const handleRowClick = (event: CustomEvent<KnowledgeTableRow>) => {
    onRowClick?.(event.detail)
  }
</script>

<div class="section">
  {#if loading}
    <div class="loading-state">
      <ProgressCircle size="S" />
      <Body size="S">Loading knowledge...</Body>
    </div>
  {:else if rows.length === 0}
    <div class="empty-state">
      <Body size="S">No files uploaded yet</Body>
    </div>
  {:else}
    <Table
      compact
      quiet
      rounded
      hideHeader
      allowClickRows={false}
      allowEditRows={false}
      allowEditColumns={false}
      on:click={handleRowClick}
      data={rows}
      schema={{
        icon: { width: "36px" },
        filename: { displayName: "Name", width: "minmax(0, 2fr)" },
        displayStatus: { displayName: "Status", width: "130px" },
        actions: {
          displayName: "",
          width: "90px",
          align: "Right",
          preventSelectRow: true,
        },
      }}
      {customRenderers}
    />
  {/if}
</div>

<style>
  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    margin-top: var(--spacing-m);
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-s);
    padding: 24px 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    padding: 24px 16px;
    text-align: center;
    border: 1px dashed var(--spectrum-global-color-gray-400);
    border-radius: var(--radius-l);
  }
</style>
