<script lang="ts">
  import { Helpers } from "@budibase/bbui"
  import { KnowledgeBaseFileStatus } from "@budibase/types"
  import type { KnowledgeTableRow } from "./types"

  export interface Props {
    row: KnowledgeTableRow
  }

  let { row }: Props = $props()
</script>

<div class="file-name">
  <span class="file-title">{row.filename}</span>
  <span class="file-meta"
    >{row.kind === "sharepoint_connection"
      ? row.subtitle || "SharePoint"
      : Helpers.capitalise(row.mimetype || "text")}</span
  >
  {#if row.kind !== "sharepoint_connection" && row.status === KnowledgeBaseFileStatus.FAILED && row.errorMessage}
    <span class="file-error">{row.errorMessage}</span>
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
  }

  .file-error {
    color: var(--spectrum-semantic-negative-color-default);
  }
</style>
