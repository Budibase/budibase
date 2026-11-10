<script lang="ts">
  import { Body, TreeView } from "@budibase/bbui"
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
    operationId: string
    siteId?: string
  }

  let { agentId, operationId, siteId }: Props = $props()

  const sharePointSource = $derived.by(() => {
    if (!siteId) {
      return undefined
    }
    const sources =
      $selectedAgent?.operations?.find(
        operation => operation.id === operationId
      )?.knowledgeSources || []
    return sources.find(
      source =>
        source.type === AgentKnowledgeSourceType.SHAREPOINT &&
        source.config.site.id === siteId
    )
  })

  const sharePointFiles: KnowledgeBaseFile[] = $derived.by(() => {
    if (!agentId || !operationId || !sharePointSource?.id) {
      return []
    }
    const _store = $agentsStore
    const files =
      agentsStore.getOperationKnowledge(agentId, operationId)?.files || []
    return files.filter(
      file =>
        (file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_SITE ||
          file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_LIST) &&
        file.source.knowledgeSourceId === sharePointSource.id
    )
  })

  const entryTree = $derived(
    buildEntryTree(
      sharePointFiles.map(file => ({
        filename: file.filename,
        sourcePath:
          file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_SITE
            ? file.source.path
            : file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_LIST
              ? `Lists/${file.source.listName}`
              : undefined,
        status: file.status,
        errorMessage: file.errorMessage,
      }))
    )
  )
</script>

{#if entryTree.length === 0}
  <Body size="S">This SharePoint site does not contain synced content.</Body>
{:else}
  <Body size="S">The following content is synced for this site:</Body>
  <div class="entries-list">
    <TreeView standalone={false} quiet width="auto">
      {#each entryTree as node (node.path)}
        <SharePointEntryTreeItem {node} />
      {/each}
    </TreeView>
  </div>
{/if}

<style>
  .entries-list {
    margin-top: var(--spacing-xxs);
    max-height: 420px;
    overflow: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
  }
</style>
