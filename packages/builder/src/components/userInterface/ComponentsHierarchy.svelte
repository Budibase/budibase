<script>
  import { params, goto } from "@sveltech/routify"
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"
  import { last, sortBy, map, trimCharsStart, trimChars, join } from "lodash/fp"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { pipe } from "components/common/core"
  import { store } from "builderStore"
  import { ArrowDownIcon, ShapeIcon } from "components/common/Icons/"
  import ScreenDropdownMenu from "./ScreenDropdownMenu.svelte"

  export let screens = []

  let confirmDeleteDialog
  let componentToDelete = ""

  const joinPath = join("/")

  const normalizedName = name =>
    pipe(name, [
      trimCharsStart("./"),
      trimCharsStart("~/"),
      trimCharsStart("../"),
      trimChars(" "),
    ])

  const changeScreen = screen => {
    store.setCurrentScreen(screen.props._instanceName)
    $goto(`./:page/${screen.props._instanceName}`)
  }
</script>

<div class="root">

  {#each screens as screen}
    <div
      class="budibase__nav-item screen-header-row"
      class:selected={$store.currentComponentInfo._id === screen.props._id}
      on:click|stopPropagation={() => changeScreen(screen)}>

      <span
        class="icon"
        class:rotate={$store.currentPreviewItem.name !== screen.props._instanceName}>
        {#if screen.props._children.length}
          <ArrowDownIcon />
        {/if}
      </span>

      <i class="ri-artboard-2-fill icon" />

      <span class="title">{screen.props._instanceName}</span>

      <div class="dropdown-menu">
        <ScreenDropdownMenu {screen} />
      </div>
    </div>

    {#if $store.currentPreviewItem.props._instanceName && $store.currentPreviewItem.props._instanceName === screen.props._instanceName && screen.props._children}
      <ComponentsHierarchyChildren
        components={screen.props._children}
        currentComponent={$store.currentComponentInfo} />
    {/if}
  {/each}

</div>

<style>
  .root {
    font-weight: 400;
    color: var(--ink);
  }

  .screen-header-row {
    display: flex;
    flex-direction: row;
  }

  .title {
    margin-left: 14px;
    font-size: 14px;
    font-weight: 400;
    flex: 1;
  }

  .icon {
    display: inline-block;
    transition: 0.2s;
    font-size: 24px;
    width: 18px;
    color: var(--grey-7);
  }

  .icon:nth-of-type(2) {
    width: 14px;
    margin: 0 0 0 5px;
  }

  :global(svg) {
    transition: 0.2s;
  }

  .rotate :global(svg) {
    transform: rotate(-90deg);
  }

  .dropdown-menu {
    display: none;
    height: 24px;
    width: 24px;
    color: var(--ink);
    padding: 0px 5px;
    border-style: none;
    background: rgba(0, 0, 0, 0);
    cursor: pointer;
    position: relative;
  }

  .budibase__nav-item:hover .dropdown-menu {
    display: block;
  }
</style>
