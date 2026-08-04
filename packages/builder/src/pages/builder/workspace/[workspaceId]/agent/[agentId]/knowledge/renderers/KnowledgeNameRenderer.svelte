<script lang="ts">
  import {
    getKnowledgeFileDisplayType,
    KnowledgeBaseFileStatus,
  } from "@budibase/types"
  import type { KnowledgeTableRow } from "./types"

  export interface Props {
    row: KnowledgeTableRow
  }

  let { row }: Props = $props()

  let errorMessage = $derived.by(() => {
    if (row.kind === "sharepoint_connection") {
      return row.errorMessage
    }
    return row.status === KnowledgeBaseFileStatus.FAILED
      ? row.errorMessage
      : undefined
  })
</script>

<div class="file-name">
  <span class="file-title">{row.filename}</span>
  {#if errorMessage}
    <span class="file-error" title={errorMessage}>{errorMessage}</span>
  {:else}
    <span
      class="file-meta"
      title={row.kind === "sharepoint_connection"
        ? row.subtitle || "SharePoint"
        : row.mimetype || "text/plain"}
      >{row.kind === "sharepoint_connection"
        ? row.subtitle || "SharePoint"
        : getKnowledgeFileDisplayType({
            filename: row.filename,
            mimetype: row.mimetype,
          })}</span
    >
  {/if}
</div>

<style>
  .file-name {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .file-title {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-meta,
  .file-error {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-error {
    color: var(--spectrum-semantic-negative-color-default);
  }
</style>
