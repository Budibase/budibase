<script>
  import { goto } from "@sveltech/routify"
  import { FrontendTypes } from "constants"
  import ComponentTree from "./ComponentNavigationTree/ComponentTree.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { last } from "lodash/fp"
  import { store, currentAsset } from "builderStore"
  import { writable } from "svelte/store"

  export let layout

  let confirmDeleteDialog
  let componentToDelete = ""

  const dragDropStore = writable({})

  const setCurrentScreenToLayout = () => {
    store.actions.selectAssetType(FrontendTypes.LAYOUT)
    $goto("./layouts")
  }
</script>

<NavItem
  border={false}
  icon="ri-layout-3-line"
  text={layout.name}
  withArrow
  selected={$store.currentComponentInfo?._id === layout.props._id}
  opened={$currentAsset._id === layout._id}
  on:click={setCurrentScreenToLayout} />

{#if $currentAsset._id === layout._id && layout.props._children}
  <ComponentTree
    layout
    components={layout.props._children}
    currentComponent={$store.currentComponentInfo}
    {dragDropStore} />
{/if}
