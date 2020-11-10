<script>
  import { goto } from "@sveltech/routify"
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { last } from "lodash/fp"
  import { store } from "builderStore"
  import { writable } from "svelte/store"

  export let layout

  let confirmDeleteDialog
  let componentToDelete = ""

  const dragDropStore = writable({})

  const lastPartOfName = c =>
    c && last(c.name ? c.name.split("/") : c._component.split("/"))

  $: _layout = {
    component: layout,
    title: lastPartOfName(layout),
  }

  const setCurrentScreenToLayout = () => {
    store.actions.selectPageOrScreen("page")
    $goto("./:page/page-layout")
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
  <ComponentsHierarchyChildren
    thisComponent={_layout.component.props}
    components={_layout.component.props._children}
    currentComponent={$store.currentComponentInfo}
    {dragDropStore} />
{/if}
