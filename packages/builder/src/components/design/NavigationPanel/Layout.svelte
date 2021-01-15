<script>
  import { goto } from "@sveltech/routify"
  import { FrontendTypes } from "constants"
  import ComponentTree from "./ComponentNavigationTree/ComponentTree.svelte"
  import LayoutDropdownMenu from "./ComponentNavigationTree/LayoutDropdownMenu.svelte"
  import initDragDropStore from "./ComponentNavigationTree/dragDropStore"
  import NavItem from "components/common/NavItem.svelte"
  import { last } from "lodash/fp"
  import { store, currentAsset, selectedComponent } from "builderStore"
  import { writable } from "svelte/store"

  export let layout
  export let border

  let confirmDeleteDialog
  let componentToDelete = ""

  const dragDropStore = initDragDropStore()

  const selectLayout = () => {
    store.actions.layouts.select(layout._id)
  }
</script>

<NavItem
  {border}
  icon="ri-layout-3-line"
  text={layout.name}
  withArrow
  selected={$store.selectedLayoutId === layout._id}
  opened={$store.selectedLayoutId === layout._id}
  on:click={selectLayout}>
  <LayoutDropdownMenu {layout} />
</NavItem>

{#if $store.selectedLayoutId === layout._id && layout.props?._children}
  <ComponentTree
    components={layout.props._children}
    currentComponent={$selectedComponent}
    {dragDropStore} />
{/if}
