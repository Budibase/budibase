<script lang="ts">
  import { Button, Modal, ModalContent, notifications } from "@budibase/bbui"
  import { KnowledgeBaseFileStatus } from "@budibase/types"
  import KnowledgeActionsRenderer from "./renderers/KnowledgeActionsRenderer.svelte"
  import KnowledgeStatusRenderer from "./renderers/KnowledgeStatusRenderer.svelte"
  import KnowledgeTypeRenderer from "./renderers/KnowledgeTypeRenderer.svelte"
  import SharePointSiteContent from "./sharepoint/SharePointSiteContent.svelte"
  import type { KnowledgeTableRow } from "./renderers/types"

  export interface Props {
    row?: KnowledgeTableRow
    agentId?: string
    operationId: string
    onEdit: (siteId: string) => Promise<void>
  }

  let { row, agentId, operationId, onEdit }: Props = $props()
  let modal = $state<Modal>()
  let editing = $state(false)
  let errorMessage = $derived(
    row?.kind === "file" && row.status === KnowledgeBaseFileStatus.FAILED
      ? row.errorMessage || "Failed to process file"
      : row?.errorMessage
  )

  export const show = () => modal?.show()
  export const hide = () => modal?.hide()

  const editFiles = async () => {
    if (row?.kind !== "sharepoint_connection") {
      return
    }
    try {
      editing = true
      await onEdit(row.siteId)
      hide()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to load SharePoint files")
    } finally {
      editing = false
    }
  }
</script>

<Modal bind:this={modal}>
  {#if row}
    <ModalContent
      size={row.kind === "sharepoint_connection" ? "XL" : "M"}
      showConfirmButton={false}
      cancelText="Close"
      onCancel={hide}
    >
      <span slot="header" class="details-title">{row.filename}</span>
      <div class="details">
        <KnowledgeTypeRenderer {row} />
        <KnowledgeStatusRenderer {row} />
        {#if row.kind === "file"}
          {#if row.size}<span>Size: {row.size}</span>{/if}
          <span>Updated: {row.updatedAt}</span>
        {:else}
          <span>{row.subtitle}</span>
        {/if}
      </div>
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
      {#if row.kind === "sharepoint_connection"}
        <SharePointSiteContent {agentId} {operationId} siteId={row.siteId} />
      {/if}
      <div slot="footer" class="actions">
        {#key row._id}
          <KnowledgeActionsRenderer {row} />
        {/key}
        {#if row.kind === "sharepoint_connection"}
          <Button
            secondary
            disabled={!row.knowledgeSearchConfigured || editing}
            on:click={editFiles}
          >
            Edit files
          </Button>
        {/if}
      </div>
    </ModalContent>
  {/if}
</Modal>

<style>
  .details {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-s) var(--spacing-m);
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .error-message {
    color: var(--spectrum-semantic-negative-color-default);
    overflow-wrap: anywhere;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .details-title {
    overflow-wrap: anywhere;
  }
</style>
