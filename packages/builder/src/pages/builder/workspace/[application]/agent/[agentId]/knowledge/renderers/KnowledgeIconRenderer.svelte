<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import MicrosoftSharepointLogo from "assets/rest-template-icons/microsoft-sharepoint.svg"
  import type { KnowledgeTableRow } from "./types"

  interface Props {
    row: KnowledgeTableRow
  }

  let { row }: Props = $props()
</script>

{#if row.kind === "sharepoint_connection"}
  <img
    class="sharepoint-logo"
    src={MicrosoftSharepointLogo}
    alt="SharePoint logo"
    width="20"
    height="20"
  />
{:else}
  <Icon size="L" name="paperclip"></Icon>
{/if}

<style>
  .sharepoint-logo {
    border-radius: 3px;
    object-fit: contain;
  }
</style>
