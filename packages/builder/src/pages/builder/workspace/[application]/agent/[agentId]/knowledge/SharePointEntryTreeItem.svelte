<script lang="ts">
  import { StatusLight, TreeItem } from "@budibase/bbui"
  import { AgentKnowledgeSourceSyncEntryStatus } from "@budibase/types"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"

  export interface Props {
    node: SharePointEntryTreeNode
    selectedPaths: string[]
    onTogglePaths: (_paths: string[], _nextSelected: boolean) => void
  }

  let { node, selectedPaths, onTogglePaths }: Props = $props()

  const collectPaths = (node: SharePointEntryTreeNode): string[] => {
    return [node.path, ...node.children.flatMap(child => collectPaths(child))]
  }

  let hasChildren = $derived(node.children.length > 0)
  let nodePaths = $derived(collectPaths(node))
  let childPaths = $derived(nodePaths.slice(1))
  let selectedChildCount = $derived(
    childPaths.filter(path => selectedPaths.includes(path)).length
  )
  let selected = $derived.by(() => {
    if (!hasChildren) {
      return selectedPaths.includes(node.path)
    }
    return childPaths.length > 0 && selectedChildCount === childPaths.length
  })
  let indeterminate = $derived.by(() => {
    if (!hasChildren) {
      return false
    }
    return selectedChildCount > 0 && selectedChildCount < childPaths.length
  })

  const statusText = (status?: AgentKnowledgeSourceSyncEntryStatus) => {
    switch (status) {
      case AgentKnowledgeSourceSyncEntryStatus.SYNCED:
        return "Ready"
      case AgentKnowledgeSourceSyncEntryStatus.SKIPPED_EXISTING:
        return "Already synced"
      case AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED:
        return "Not supported"
      case AgentKnowledgeSourceSyncEntryStatus.FAILED:
        return "Failed"
      case AgentKnowledgeSourceSyncEntryStatus.EXCLUDED:
        return "Excluded"
      default:
        return undefined
    }
  }

  const statusProps = (status?: AgentKnowledgeSourceSyncEntryStatus) => {
    switch (status) {
      case AgentKnowledgeSourceSyncEntryStatus.SYNCED:
      case AgentKnowledgeSourceSyncEntryStatus.SKIPPED_EXISTING:
        return { positive: true }
      case AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED:
      case AgentKnowledgeSourceSyncEntryStatus.FAILED:
        return { negative: true }
      default:
        return { notice: true }
    }
  }

  const handleSelect = (_event: CustomEvent<boolean>) => {
    const nextSelected = indeterminate ? true : !selected
    onTogglePaths(nodePaths, nextSelected)
  }
</script>

<TreeItem
  title={node.name}
  {selected}
  checked={selected}
  {indeterminate}
  open={hasChildren}
  hasChildren={hasChildren}
  on:select={handleSelect}
>
  <svelte:fragment slot="post">
    {#if node.type === "file" && statusText(node.status)}
      <StatusLight size="S" {...statusProps(node.status)}>
        {statusText(node.status)}
      </StatusLight>
    {/if}
  </svelte:fragment>

  {#if hasChildren}
    {#each node.children as child (child.path)}
      <SharePointEntryTreeItem node={child} {selectedPaths} {onTogglePaths} />
    {/each}
  {/if}
</TreeItem>
