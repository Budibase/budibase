<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { getKnowledgeFileDisplayType } from "@budibase/types"
  import MicrosoftSharepointLogo from "assets/rest-template-icons/microsoft-sharepoint.svg"
  import type { KnowledgeTableRow } from "./types"

  let { row }: { row: KnowledgeTableRow } = $props()
</script>

<span class="knowledge-type">
  {#if row.kind === "sharepoint_connection"}
    <img src={MicrosoftSharepointLogo} alt="" width="14" height="14" />
    SharePoint
  {:else}
    <Icon name="file-text" size="XS" />
    {getKnowledgeFileDisplayType({
      filename: row.filename,
      mimetype: row.mimetype,
    })}
  {/if}
</span>

<style>
  .knowledge-type {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--spectrum-global-color-gray-700);
    font-size: 11px;
    line-height: 15px;
  }
</style>
