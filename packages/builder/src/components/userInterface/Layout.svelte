<script>
  import { goto } from "@sveltech/routify"
  import { FrontendTypes } from "constants"
  import ComponentTree from "./ComponentNavigationTree/ComponentTree.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { last } from "lodash/fp"
  import { store, currentAsset } from "builderStore"
  import { writable } from "svelte/store"

  export let layout = $currentAsset

  let confirmDeleteDialog
  let componentToDelete = ""

  const dragDropStore = writable({})

  const lastPartOfName = c =>
    c && last(c.name ? c.name.split("/") : c._component.split("/"))

  $: _layout = {
    component: $currentAsset,
    title: lastPartOfName(layout),
  }

  const setCurrentScreenToLayout = () => {
    store.actions.selectAssetType(FrontendTypes.LAYOUT)
    $goto("./layouts")
  }
</script>

<NavItem
  border={false}
  icon="ri-layout-3-line"
  text="Master Screen"
  withArrow
  selected={$store.currentComponentInfo?._id === _layout.component.props._id}
  opened={$store.currentPreviewItem?.name === _layout.title}
  on:click={setCurrentScreenToLayout} />

{#if $store.currentPreviewItem?.name === _layout.title && _layout.component.props._children}
  <ComponentTree
    components={_layout.component.props._children}
    currentComponent={$store.currentComponentInfo}
    {dragDropStore} />
{/if}
