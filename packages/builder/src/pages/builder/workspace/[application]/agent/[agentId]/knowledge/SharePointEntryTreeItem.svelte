<script lang="ts">
  import { TreeItem } from "@budibase/bbui"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"

  export interface SharePointEntryTreeNode {
    id: string
    name: string
    path: string
    type: "folder" | "file"
    children: SharePointEntryTreeNode[]
  }

  export interface Props {
    node: SharePointEntryTreeNode
    selectedPaths: string[]
    onToggle: (_path: string) => void
  }

  let { node, selectedPaths, onToggle }: Props = $props()

  let selected = $derived(selectedPaths.includes(node.path))
  let hasChildren = $derived(node.children.length > 0)
  let icon = $derived(node.type === "folder" ? "folder" : "file")

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    onToggle(node.path)
  }
</script>

<TreeItem
  title={node.name}
  {selected}
  open={hasChildren}
  {icon}
  on:click={handleClick}
>
  {#if hasChildren}
    {#each node.children as child (child.path)}
      <SharePointEntryTreeItem node={child} {selectedPaths} {onToggle} />
    {/each}
  {/if}
</TreeItem>
