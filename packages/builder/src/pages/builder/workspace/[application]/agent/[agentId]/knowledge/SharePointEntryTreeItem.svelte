<script lang="ts">
  import { StatusLight, TreeItem } from "@budibase/bbui"
  import { AgentKnowledgeSourceSyncEntryStatus } from "@budibase/types"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"

  export interface Props {
    node: SharePointEntryTreeNode
    selectedPaths: string[]
    onToggle: (_path: string) => void
  }

  let { node, selectedPaths, onToggle }: Props = $props()

  let selected = $derived(selectedPaths.includes(node.path))
  let hasChildren = $derived(node.children.length > 0)

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
    onToggle(node.path)
  }
</script>

<TreeItem
  title={node.name}
  {selected}
  checked={selected}
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
      <SharePointEntryTreeItem node={child} {selectedPaths} {onToggle} />
    {/each}
  {/if}
</TreeItem>
