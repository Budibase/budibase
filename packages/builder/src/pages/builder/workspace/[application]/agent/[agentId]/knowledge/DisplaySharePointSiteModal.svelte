<script lang="ts">
  import {
    ActionButton,
    Body,
    Modal,
    ModalContent,
    TreeView,
  } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceType,
    KnowledgeBaseFileStatus,
    type KnowledgeBaseFile,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import { buildEntryTree } from "./sharePointModalUtils"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"

  export interface Props {
    agentId?: string
    siteId?: string
    onEdit?: (_siteId: string) => Promise<void> | void
  }

  let { agentId, siteId, onEdit }: Props = $props()

  let editing = $state(false)
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

  const sourceEntries = $derived.by(() => {
    if (!agentId || !siteId) {
      return []
    }
    return (
      $agentsStore.knowledgeByAgentId[agentId]?.sourceEntriesBySiteId?.[siteId]
        ?.entries || []
    )
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

  const filterTreeByPaths = (
    nodes: SharePointEntryTreeNode[],
    allowedPaths: Set<string>
  ): SharePointEntryTreeNode[] => {
    const nextNodes: SharePointEntryTreeNode[] = []
    for (const node of nodes) {
      if (node.type === "file") {
        if (allowedPaths.has(node.path)) {
          nextNodes.push(node)
        }
        continue
      }

      const children = filterTreeByPaths(node.children, allowedPaths)
      if (children.length > 0) {
        nextNodes.push({ ...node, children })
      }
    }
    return nextNodes
  }

  const displayTree = $derived.by(() => {
    if (sourceEntries.length === 0) {
      return entryTree
    }
    const allowedPaths = new Set(sourceEntries.map(entry => entry.path))
    return filterTreeByPaths(entryTree, allowedPaths)
  })

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
    editing = true
    try {
      await onEdit(siteId)
      hide()
    } finally {
      editing = false
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showCloseIcon={false}
    showDivider={false}
    showConfirmButton
    confirmText="Close"
    cancelText="Close"
    disabled={!sourceId}
    onConfirm={hide}
    onCancel={hide}
  >
    <div class="content">
      <div class="title">
        <Body size="S">SharePoint - {selectedSiteLabel}</Body>
      </div>

      <div class="entries-header">
        <Body size="M">Synced files</Body>
        <ActionButton quiet size="S" loading={editing} on:click={handleEdit}>
          Edit files
        </ActionButton>
      </div>

      {#if displayTree.length === 0}
        <Body size="S">
          {showProcessingState
            ? "SharePoint sync is in progress. Files will appear here shortly."
            : "No selected files found for this site."}
        </Body>
      {:else}
        <div class="entries-list">
          <TreeView width="100%" standalone={false} quiet>
            {#each displayTree as node (node.path)}
              <SharePointEntryTreeItem {node} />
            {/each}
          </TreeView>
        </div>
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .content {
    padding: var(--spacing-l);
    width: min(760px, 95vw);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .title {
    padding-bottom: var(--spacing-xxs);
  }

  .entries-header {
    margin-top: var(--spacing-xxs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .entries-header :global(.spectrum-ActionButton:first-of-type) {
    margin-left: auto;
  }

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
