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
    return !(node.type === "file" && !isSelectableSharePointStatus(node.status))
  }

  let hasChildren = $derived(node.children.length > 0)
  let allNodes = $derived(collectNodes(node))
  let nodeByPath = $derived(
    new Map(allNodes.map(current => [current.path, current] as const))
  )
  let nodePaths = $derived(collectPaths(node))
  let childPaths = $derived(nodePaths.slice(1))
  let selectedSet = $derived(new Set(selectedPaths))
  let selectableChildPaths = $derived(
    childPaths.filter(path => {
      const childNode = nodeByPath.get(path)
      return !!childNode && isSelectableNode(childNode)
    })
  )
  let targetPaths = $derived(
    hasChildren
      ? selectableChildPaths
      : isSelectableNode(node)
        ? [node.path]
        : []
  )
  let selected = $derived.by(() => {
    if (!hasChildren) {
      if (!isSelectableNode(node)) {
        return false
      }
      return selectedPaths.includes(node.path)
    }
    return (
      selectableChildPaths.length > 0 &&
      selectableChildPaths.every(path => selectedSet.has(path))
    )
  })
  let indeterminate = $derived.by(() => {
    if (!hasChildren) {
      return false
    }
    const selectedChildCount = selectableChildPaths.filter(path =>
      selectedSet.has(path)
    ).length
    return (
      selectedChildCount > 0 && selectedChildCount < selectableChildPaths.length
    )
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
      <StatusLight size="S" {...getSharePointStatusLightProps(node.status)}>
        {getSharePointStatusText(node.status)}
      </StatusLight>
    {/if}
  </svelte:fragment>

  {#if hasChildren}
    {#each node.children as child (child.path)}
      <SharePointEntryTreeItem node={child} {selectedPaths} {onTogglePaths} />
    {/each}
  {/if}
</TreeItem>
