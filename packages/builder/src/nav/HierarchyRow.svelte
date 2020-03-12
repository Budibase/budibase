<script>
  import { getContext } from "svelte";
  import { store } from "../builderStore"
  import { cloneDeep } from "lodash/fp"
  import getIcon from "../common/icon"
  export let level = 0
  export let node
  export let type

  let navActive = ""

  const ICON_MAP = {
    index: "ri-equalizer-line",
    record: "ri-list-settings-line"
  }

  store.subscribe(state => {
    if (state.currentNode) {
      navActive = node.nodeId === state.currentNode.nodeId
    }
  })
</script>

<div>
  <div
    on:click={() => store.selectExistingNode(node.nodeId)}
    class="budibase__nav-item hierarchy-item"
    class:capitalized={type === "record"}
    style="padding-left: {20 + level * 20}px"
    class:selected={navActive}>
    <i class={ICON_MAP[type]} />
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

<style>
.hierarchy-item {
  font-size: 14px;
  font-weight: 400;
}

.capitalized {
  text-transform: capitalize;
}
</style>
