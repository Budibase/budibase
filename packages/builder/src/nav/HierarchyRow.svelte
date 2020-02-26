<script>
  import { store } from "../builderStore"
  import { cloneDeep } from "lodash/fp"
  import getIcon from "../common/icon"
  export let level = 0
  export let node
  export let type

  let navActive = ""
  $: icon = type === "index" ? "list" : "file"

  store.subscribe(state => {
    if (state.currentNode) {
      navActive =
        state.activeNav === "database" && node.nodeId === state.currentNode.nodeId
    }
  })
</script>

<div>
  <div
    on:click={() => store.selectExistingNode(node.nodeId)}
    class="budibase__nav-item"
    style="padding-left: {20 + level * 20}px"
    class:selected={navActive}>
    {@html getIcon(icon, 12)}
    <span style="margin-left: 1rem">{node.name}</span>
  </div>
  {#if node.children}
    {#each node.children as child}
      <svelte:self node={child} level={level + 1} type="record" />
    {/each}
  {/if}
  {#if node.indexes}
    {#each node.indexes as index}
      <svelte:self node={index} level={level + 1} type="index" />
    {/each}
  {/if}
</div>
