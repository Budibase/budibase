<script lang="ts">
  import { KnowledgeBaseFileStatus } from "@budibase/types"
  import { StatusLight, TreeItem } from "@budibase/bbui"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"

  export interface Props {
    node: SharePointEntryTreeNode
    selectedPaths?: string[]
    onTogglePaths?: (_paths: string[], _nextSelected: boolean) => void
    showStatus?: boolean
  }

  let {
    node,
    selectedPaths,
    onTogglePaths,
    showStatus = true,
  }: Props = $props()

  const getSharePointStatusText = (
    status?: SharePointEntryTreeNode["status"]
  ) => {
    switch (status) {
      case KnowledgeBaseFileStatus.PROCESSING:
        return "Processing"
      case KnowledgeBaseFileStatus.READY:
        return "Ready"
      case KnowledgeBaseFileStatus.FAILED:
        return "Failed"
      default:
        return undefined
    }
  }

  const getSharePointStatusLightProps = (
    status?: SharePointEntryTreeNode["status"]
  ) => {
    switch (status) {
      case KnowledgeBaseFileStatus.READY:
        return { positive: true }
      case KnowledgeBaseFileStatus.FAILED:
        return { negative: true }
      default:
        return { notice: true }
    }
  }

  let hasChildren = $derived(node.children.length > 0)
</script>

<div class="sharepoint-entry-tree-item">
  <TreeItem title={node.name} open={hasChildren} {hasChildren}>
    <svelte:fragment slot="post">
      {#if showStatus && node.type === "file" && getSharePointStatusText(node.status)}
        <div class="status-container">
          <StatusLight size="S" {...getSharePointStatusLightProps(node.status)}>
            {getSharePointStatusText(node.status)}
          </StatusLight>
          {#if node.status === "failed" && node.errorMessage}
            <span class="error-message" title={node.errorMessage}>
              {node.errorMessage}
            </span>
          {/if}
        </div>
      {/if}
    </svelte:fragment>

    {#if hasChildren}
      {#each node.children as child (child.path)}
        <SharePointEntryTreeItem
          node={child}
          {selectedPaths}
          {onTogglePaths}
          {showStatus}
        />
      {/each}
    {/if}
  </TreeItem>
</div>

<style>
  .status-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    min-width: 0;
  }

  .error-message {
    font-size: 11px;
    line-height: 1.2;
    color: var(--spectrum-semantic-negative-color-default);
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sharepoint-entry-tree-item :global(.spectrum-TreeView-itemLink) {
    padding-inline-end: 8px;
  }
</style>
