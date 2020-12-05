<script>
  import { goto } from "@sveltech/routify"
  import { FrontendTypes } from "constants"
  import ComponentTree from "./ComponentNavigationTree/ComponentTree.svelte"
  import LayoutDropdownMenu from "./ComponentNavigationTree/LayoutDropdownMenu.svelte"
  import initDragDropStore from "./ComponentNavigationTree/dragDropStore"
  import NavItem from "components/common/NavItem.svelte"
  import { last } from "lodash/fp"
  import { store, currentAsset } from "builderStore"
  import { writable } from "svelte/store"

  export let layout

  let confirmDeleteDialog
  let componentToDelete = ""

  const dragDropStore = initDragDropStore()

  const selectLayout = () => {
    store.actions.layouts.select(layout._id)
    $goto(`./layout/${layout._id}`)
  }
</script>

<NavItem
  border={false}
  icon="ri-layout-3-line"
  text={layout.name}
  withArrow
  selected={$store.currentComponentInfo?._id === layout.props?._id}
  opened={$store.currentAssetId === layout._id}
  on:click={selectLayout}>
  <LayoutDropdownMenu {layout} />
</NavItem>

{#if $store.currentAssetId === layout._id && layout.props?._children}
  <ComponentTree
    components={layout.props._children}
    currentComponent={$store.currentComponentInfo}
    {dragDropStore} />
{/if}
