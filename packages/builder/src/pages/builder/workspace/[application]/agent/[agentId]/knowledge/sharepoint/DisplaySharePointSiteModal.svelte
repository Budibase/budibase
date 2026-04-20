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

  const sourceId = $derived(sharePointSource?.id)
  const selectedSiteLabel = $derived(
    sharePointSource?.config.site?.name ||
      sharePointSource?.config.site?.webUrl ||
      siteId ||
      ""
  )

  const getKnowledgeSourceFiles = (
    files: KnowledgeBaseFile[],
    knowledgeSourceId?: string,
    sharePointSiteId?: string
  ): KnowledgeBaseFile[] =>
    files.filter(file => {
      if (knowledgeSourceId && file.knowledgeSourceId === knowledgeSourceId) {
        return true
      }
      return (
        !!sharePointSiteId &&
        !!file.originFileId?.startsWith(`sharepoint:${sharePointSiteId}:`)
      )
    })

  const sharePointFiles = $derived.by(() => {
    if (!agentId || !sourceId) {
      return [] as KnowledgeBaseFile[]
    }
    const files = $agentsStore.knowledgeByAgentId[agentId]?.files || []
    return getKnowledgeSourceFiles(files, sourceId, siteId)
  })

  const sourceRun = $derived.by(() => {
    if (!agentId || !sourceId) {
      return undefined
    }
    const runs = $agentsStore.knowledgeByAgentId[agentId]?.sourceRuns || []
    return runs.find(run => run.sourceId === sourceId)
  })

  const entryTree = $derived(
    buildEntryTree(
      sharePointFiles.map(file => ({
        filename: file.filename,
        sourcePath: file.sourcePath,
        status: file.status,
        errorMessage: file.errorMessage,
      })),
      sourceRun?.entries || []
    )
  )

  const showProcessingState = $derived.by(() => {
    if (!sourceId) {
      return false
    }
    if (!sourceRun) {
      return true
    }
    return sharePointFiles.some(
      file => file.status === KnowledgeBaseFileStatus.PROCESSING
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
    disabled={!sourceId}
    onConfirm={hide}
    onCancel={hide}
    size="XL"
    showConfirmButton={false}
    showCancelButton={false}
    showSecondaryButton
    secondaryButtonText="Edit files"
    secondaryAction={handleEdit}
  >
    {#if entryTree.length === 0}
      <Body size="S">
        {showProcessingState
          ? "SharePoint sync is in progress. Files will appear here shortly."
          : "No selected files found for this site."}
      </Body>
    {:else}
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
    padding: var(--spacing-xs);
    background: var(--spectrum-global-color-gray-100);
  }

  .entries-list :global(.spectrum-TreeView-itemLink) {
    min-height: 30px;
    border-radius: 6px;
    padding-inline-end: 8px;
  }
</style>
