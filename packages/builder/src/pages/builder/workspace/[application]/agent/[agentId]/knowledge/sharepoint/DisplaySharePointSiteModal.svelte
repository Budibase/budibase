<script lang="ts">
  import { Body, Modal, ModalContent, TreeView } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceType,
    KnowledgeBaseFileStatus,
    type KnowledgeBaseFile,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import SharePointEntryTreeItem from "./tree/SharePointEntryTreeItem.svelte"
  import { buildEntryTree } from "./sharePointModalUtils"

  export interface Props {
    agentId?: string
    siteId?: string
    onEdit?: (_siteId: string) => Promise<void> | void
  }

  let { agentId, siteId, onEdit }: Props = $props()

  let modal = $state<Modal>()

  const sharePointSource = $derived.by(() => {
    if (!siteId) {
      return undefined
    }
    return $selectedAgent?.knowledgeSources?.find(
      source =>
        source.type === AgentKnowledgeSourceType.SHAREPOINT &&
        source.config.site?.id === siteId
    )
  })

  const selectedSiteLabel = $derived(
    sharePointSource?.config.site?.name ||
      sharePointSource?.config.site?.webUrl ||
      siteId ||
      ""
  )

  const sourceSnapshot = $derived.by(() => {
    if (!agentId || !siteId) {
      return undefined
    }
    return ($agentsStore.knowledgeByAgentId[agentId]?.sharePointSources || []).find(
      source => source.siteId === siteId
    )
  })

  const sharePointFiles = $derived.by(() => {
    if (!agentId || !sharePointSource?.id) {
      return [] as KnowledgeBaseFile[]
    }
    const files = $agentsStore.knowledgeByAgentId[agentId]?.files || []
    return files.filter(file => file.knowledgeSourceId === sharePointSource.id)
  })

  const entryTree = $derived(
    buildEntryTree(
      sharePointFiles.map(file => ({
        filename: file.filename,
        sourcePath: file.sourcePath,
        status: file.status,
        errorMessage: file.errorMessage,
      })),
      sourceSnapshot?.entries || []
    )
  )

  const showProcessingState = $derived.by(() => {
    if (!sourceSnapshot) {
      return false
    }
    return (
      sourceSnapshot.status === "connecting" ||
      sourceSnapshot.status === "syncing" ||
      sharePointFiles.some(file => file.status === KnowledgeBaseFileStatus.PROCESSING)
    )
  })

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleEdit = async () => {
    if (!siteId || !onEdit) {
      return
    }

    await onEdit(siteId)
    hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={`SharePoint - ${selectedSiteLabel}`}
    showDivider={false}
    size="XL"
    confirmText="Edit files"
    onConfirm={handleEdit}
    onCancel={hide}
    showCloseIcon={false}
  >
    {#if entryTree.length === 0}
      <Body size="S">
        {showProcessingState
          ? "SharePoint sync is in progress. Files will appear here shortly."
          : "No selected files found for this site."}
      </Body>
    {:else}
      <Body size="S">The following files are selected for this site:</Body>
      <div class="entries-list">
        <TreeView standalone={false} quiet width="auto" selectable={false}>
          {#each entryTree as node (node.path)}
            <SharePointEntryTreeItem {node} />
          {/each}
        </TreeView>
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .entries-list {
    margin-top: var(--spacing-xxs);
    max-height: 420px;
    overflow: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
  }
</style>
