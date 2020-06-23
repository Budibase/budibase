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

  const lastPartOfName = c => {
    if (!c) return ""
    const name = c.name ? c.name : c._component ? c._component : c
    return last(name.split("/"))
  }

  const isComponentSelected = (current, comp) => current === comp

  $: _screens = pipe(screens, [
    map(c => ({ component: c, title: lastPartOfName(c) })),
    sortBy("title"),
  ])

  const changeScreen = screen => {
    store.setCurrentScreen(screen.title)
    $goto(`./:page/${screen.title}`)
  }
</script>

<div class="root">
  {#each _screens as screen}
    <div
      class="budibase__nav-item component"
      class:selected={$store.currentComponentInfo._id === screen.component.props._id}
      on:click|stopPropagation={() => changeScreen(screen)}>

      <span
        class="icon"
        class:rotate={$store.currentPreviewItem.name !== screen.title}>
        {#if screen.component.props._children.length}
          <ArrowDownIcon />
        {/if}
      </span>

      <i class="ri-artboard-2-fill icon" />

      <span class="title">{screen.title}</span>
    </div>

    {#if $store.currentPreviewItem.name === screen.title && screen.component.props._children}
      <ComponentsHierarchyChildren
        components={screen.component.props._children}
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
</style>
