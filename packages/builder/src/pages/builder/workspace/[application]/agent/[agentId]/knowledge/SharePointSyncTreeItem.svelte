<script lang="ts">
  import { StatusLight, TreeItem } from "@budibase/bbui"
  import { AgentKnowledgeSourceSyncEntryStatus } from "@budibase/types"
  import SharePointSyncTreeItem from "./SharePointSyncTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"

  export interface Props {
    node: SharePointEntryTreeNode
  }

  let { node }: Props = $props()

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
      default:
        return undefined
    }
  }

  const statusTone = (
    status?: AgentKnowledgeSourceSyncEntryStatus
  ): "positive" | "negative" | "notice" | undefined => {
    switch (status) {
      case AgentKnowledgeSourceSyncEntryStatus.SYNCED:
      case AgentKnowledgeSourceSyncEntryStatus.SKIPPED_EXISTING:
        return "positive"
      case AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED:
      case AgentKnowledgeSourceSyncEntryStatus.FAILED:
        return "negative"
      default:
        return "notice"
    }
  }

  let currentStatusText = $derived(
    node.type === "file" ? statusText(node.status) : undefined
  )

  let currentStatusTone = $derived(
    node.type === "file" ? statusTone(node.status) : undefined
  )

  const statusProps = (tone?: "positive" | "negative" | "notice") => {
    return {
      positive: tone === "positive",
      negative: tone === "negative",
      notice: tone === "notice",
    }
  }
</script>

<TreeItem
  title={node.name}
  open={hasChildren}
  hasChildren={hasChildren}
>
  <svelte:fragment slot="post">
    {#if node.type === "file" && currentStatusText}
      <StatusLight size="S" {...statusProps(currentStatusTone)}>
        {currentStatusText}
      </StatusLight>
    {/if}
  </svelte:fragment>

  {#if hasChildren}
    {#each node.children as child (child.path)}
      <SharePointSyncTreeItem node={child} />
    {/each}
  {/if}
</TreeItem>
