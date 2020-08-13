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

  const setCurrentScreenToLayout = () => {
    store.setScreenType("page")
    $goto("./:page/page-layout")
  }
</script>

<div
  class="budibase__nav-item root"
  class:selected={$store.currentComponentInfo._id === _layout.component.props._id}
  on:click|stopPropagation={setCurrentScreenToLayout}>
  <span
    class="icon"
    class:rotate={$store.currentPreviewItem.name !== _layout.title}>
    <ArrowDownIcon />
  </span>
  <i class="ri-layout-3-fill icon-big" />
  <span class="title">Master Screen</span>
</div>

{#if $store.currentPreviewItem.name === _layout.title && _layout.component.props._children}
  <ComponentsHierarchyChildren
    thisComponent={_layout.component.props}
    components={_layout.component.props._children}
    currentComponent={$store.currentComponentInfo} />
{/if}

<style>
  .title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
    color: var(--ink);
  }

  .icon {
    width: 24px;
    display: inline-block;
    transition: 0.2s;
    width: 20px;
    color: var(--grey-7);
  }

  .icon-big {
    font-size: 20px;
    color: var(--grey-7);
  }

  .rotate :global(svg) {
    transform: rotate(-90deg);
  }
</style>
