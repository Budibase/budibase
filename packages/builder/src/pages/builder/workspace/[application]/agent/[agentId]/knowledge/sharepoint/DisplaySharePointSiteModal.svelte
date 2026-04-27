<script lang="ts">
  import { Body, Modal, ModalContent, TreeView } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceType,
    KnowledgeBaseFileSourceType,
    type KnowledgeBaseFile,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import SharePointEntryTreeItem from "./tree/SharePointEntryTreeItem.svelte"
  import { buildEntryTree } from "./sharePointModalUtils"

  export interface Props {
    agentId?: string
    siteId?: string
  }

  let { agentId, siteId }: Props = $props()
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

  const sharePointFiles = $derived.by(() => {
    if (!agentId || !sharePointSource?.id) {
      return [] as KnowledgeBaseFile[]
    }
    const files = $agentsStore.knowledgeByAgent?.[agentId]?.files || []
    return files.filter(
      file =>
        file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT &&
        file.source.knowledgeSourceId === sharePointSource.id
    )
  })

  const entryTree = $derived(
    buildEntryTree(
      sharePointFiles.map(file => ({
        filename: file.filename,
        sourcePath: file.source?.path,
        status: file.status,
        errorMessage: file.errorMessage,
      }))
    )
  )

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={`SharePoint - ${selectedSiteLabel}`}
    showDivider={false}
    size="XL"
    showCloseIcon={false}
    showConfirmButton={false}
    showCancelButton={false}
  >
    {#if entryTree.length === 0}
      <Body size="S">This SharePoint site does not contain any file.</Body>
    {:else}
      <Body size="S">The following files are synced for this site:</Body>
      <div class="entries-list">
        <TreeView standalone={false} quiet width="auto">
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
