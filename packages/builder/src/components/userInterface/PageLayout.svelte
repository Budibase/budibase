<script>
  import { goto } from "@sveltech/routify"
  // import { tick } from "svelte"
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"

  import {
    last,
    sortBy,
    map,
    trimCharsStart,
    trimChars,
    join,
    compose,
  } from "lodash/fp"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { pipe } from "components/common/core"
  import { store } from "builderStore"
  import { ArrowDownIcon, GridIcon } from "components/common/Icons/"

  export let layout

  let confirmDeleteDialog
  let componentToDelete = ""

  const joinPath = join("/")

  const lastPartOfName = c =>
    c && last(c.name ? c.name.split("/") : c._component.split("/"))

  const isComponentSelected = (current, comp) => current === comp

  $: _layout = {
    component: layout,
    title: lastPartOfName(layout),
  }

  const confirmDeleteComponent = async component => {
    componentToDelete = component
    confirmDeleteDialog.show()
  }

  const setCurrentScreenToLayout = () => {
    store.setScreenType("page")
    $goto("./:page/page-layout")
  }
</script>

<div class="pagelayoutSection">
  <div
    class="budibase__nav-item root"
    class:selected={$store.currentComponentInfo._id === _layout.component.props._id}
    on:click|stopPropagation={setCurrentScreenToLayout}>
    <span
      class="icon"
      class:rotate={$store.currentPreviewItem.name !== _layout.title}>
      <ArrowDownIcon />
    </span>
  <i class="ri-layout-3-fill icon-big"></i>
  <span class="title">Master Screen</span>
  </div>

  {#if $store.currentPreviewItem.name === _layout.title && _layout.component.props._children}
    <ComponentsHierarchyChildren
      thisComponent={_layout.component.props}
      components={_layout.component.props._children}
      currentComponent={$store.currentComponentInfo}
      onDeleteComponent={confirmDeleteComponent}
      onMoveUpComponent={store.moveUpComponent}
      onMoveDownComponent={store.moveDownComponent}
      onCopyComponent={store.copyComponent} />
  {/if}
</div>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete this '${lastPartOfName(componentToDelete)}' component?`}
  okText="Delete Component"
  onOk={() => store.deleteComponent(componentToDelete)} />

<style>

  .pagelayoutSection {
    margin: 20px 0px 0px 0px;
  }

  .title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
  }

  .icon {
    width: 24px;
    display: inline-block;
    transition: 0.2s;
    width: 20px;
    color: var(--ink-light);
  }

  .icon-big {
    font-size: 24px;
    color: var(--ink-light);
  }

  :global(svg) {
    transition: 0.2s;
  }

  .rotate :global(svg) {
    transform: rotate(-90deg);
  }
</style>
