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

  export let node
  export let type
  export let onSelect

  let navActive = ""

  const ICON_MAP = {
    index: "ri-eye-line",
    model: "ri-list-settings-line",
  }
</script>

<div>
  <div
    on:click={() => onSelect(node)}
    class="budibase__nav-item hierarchy-item"
    class:capitalized={type === 'model'}
    class:selected={$backendUiStore.selectedView === `all_${node._id}`}>
    <i class={ICON_MAP[type]} />
    <span style="margin-left: 1rem">{node.name}</span>
    <!-- <i
      class="ri-edit-line hoverable"
      on:click={editModel}
    />
    <i
      class="ri-delete-bin-7-line hoverable"
      on:click={deleteModel}
    /> -->
  </div>
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
