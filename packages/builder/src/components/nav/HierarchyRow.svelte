<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { cloneDeep } from "lodash/fp"
  import getIcon from "../common/icon"
  import {
    CreateEditModelModal,
    CreateEditViewModal,
  } from "components/database/ModelDataTable/modals"

  const { open, close } = getContext("simple-modal")

  // export let level = 0
  export let node
  export let type

  let navActive = ""

  const ICON_MAP = {
    index: "ri-eye-line",
    model: "ri-list-settings-line",
  }

  store.subscribe(state => {
    if (state.currentNode) {
      navActive = node.nodeId === state.currentNode.nodeId
    }
  })

  function selectModel(model) {
    backendUiStore.update(state => {
      state.selectedModel = model
      state.selectedView = `all_${model._id}`
      return state;
    })
    // store.selectExistingNode(node.nodeId)
    // const modalType =
    //   node.type === "index" ? CreateEditViewModal : CreateEditModelModal
    // open(
    //   modalType,
    //   {
    //     onClosed: close,
    //   },
    //   { styleContent: { padding: "0" } }
    // )
  }
</script>

<div>
  <div
    on:click={() => selectModel(node)}
    class="budibase__nav-item hierarchy-item"
    class:capitalized={type === 'model'}
    class:selected={$backendUiStore.selectedModel._id === node._id}>
    <i class={ICON_MAP[type]} />
    <span style="margin-left: 1rem">{node.name}</span>
  </div>
  <!-- {#if node.children}
    {#each node.children as child}
      <svelte:self node={child} level={level + 1} type="model" />
    {/each}
  {/if}
  {#if node.indexes}
    {#each node.indexes as index}
      <svelte:self node={index} level={level + 1} type="index" />
    {/each}
  {/if} -->
</div>

<style>
  .hierarchy-item {
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 10px;
    padding-left: 20px;
  }

  .capitalized {
    text-transform: capitalize;
  }
</style>
