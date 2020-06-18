<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { cloneDeep } from "lodash/fp"
  import getIcon from "../common/icon"
  import {
    CreateEditViewModal,
  } from "components/database/ModelDataTable/modals"
  import api from "builderStore/api"

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
