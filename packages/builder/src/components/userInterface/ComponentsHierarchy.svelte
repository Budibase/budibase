<script>
  import { params, goto } from "@sveltech/routify"
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"
  import { last, sortBy, map, trimCharsStart, trimChars, join } from "lodash/fp"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { pipe } from "components/common/core"
  import { store } from "builderStore"
  import { ArrowDownIcon, ShapeIcon } from "components/common/Icons/"

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
    $goto(`./:page/${screen.title}`)
  }
</script>

<div class="root">
  {#each screens as screen}
    <div
      class="budibase__nav-item component"
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

  .title {
    margin-left: 10px;
    margin-top: 2px;
    font-size: 14px;
    font-weight: 400;
  }

  .icon {
    display: inline-block;
    transition: 0.2s;
    font-size: 24px;
    width: 20px;
    margin-top: 2px;
    color: var(--ink-light);
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
</style>
