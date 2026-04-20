<script lang="ts">
  import { StatusLight, TreeItem } from "@budibase/bbui"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"
  import {
    getSharePointStatusLightProps,
    getSharePointStatusText,
    isSelectableSharePointStatus,
  } from "./sharePointStatus"

  export interface Props {
    node: SharePointEntryTreeNode
    selectedPaths: string[]
    onTogglePaths: (_paths: string[], _nextSelected: boolean) => void
  }

  let { node, selectedPaths, onTogglePaths }: Props = $props()

  const collectPaths = (node: SharePointEntryTreeNode): string[] => {
    return [node.path, ...node.children.flatMap(child => collectPaths(child))]
  }

  const collectNodes = (
    node: SharePointEntryTreeNode
  ): SharePointEntryTreeNode[] => {
    return [node, ...node.children.flatMap(child => collectNodes(child))]
  }

  const isSelectableNode = (node: SharePointEntryTreeNode): boolean => {
    if (node.type === "folder") {
      return true
    }
    return isSelectableSharePointStatus(node.status)
  }

  let hasChildren = $derived(node.children.length > 0)
  let allNodes = $derived(collectNodes(node))
  let nodeByPath = $derived(
    new Map(allNodes.map(current => [current.path, current] as const))
  )
  let nodePaths = $derived(collectPaths(node))
  let childPaths = $derived(nodePaths.slice(1))
  let selectedSet = $derived(new Set(selectedPaths))
  let selectableDescendantPaths = $derived(
    childPaths.filter(path => {
      const childNode = nodeByPath.get(path)
      return !!childNode && isSelectableNode(childNode)
    })
  )
  let targetPaths = $derived.by(() => {
    if (!isSelectableNode(node)) {
      return []
    }
    if (node.type === "file") {
      return [node.path]
    }
    return [node.path, ...selectableDescendantPaths]
  })
  let selected = $derived.by(() => {
    if (targetPaths.length === 0) {
      return false
    }
    return targetPaths.every(path => selectedSet.has(path))
  })
  let indeterminate = $derived.by(() => {
    if (targetPaths.length === 0) {
      return false
    }
    const selectedCount = targetPaths.filter(path =>
      selectedSet.has(path)
    ).length
    return selectedCount > 0 && selectedCount < targetPaths.length
  })
  let disabled = $derived(targetPaths.length === 0)

  const handleSelect = (_event: CustomEvent<boolean>) => {
    const nextSelected = indeterminate ? true : !selected
    onTogglePaths(targetPaths, nextSelected)
  }
</script>

<TreeItem
  title={node.name}
  {selected}
  checked={selected}
  {indeterminate}
  {disabled}
  open={hasChildren}
  {hasChildren}
  on:select={handleSelect}
>
  <svelte:fragment slot="post">
    {#if node.type === "file" && getSharePointStatusText(node.status)}
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
      <SharePointEntryTreeItem node={child} {selectedPaths} {onTogglePaths} />
    {/each}
  {/if}
</TreeItem>

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
</style>
