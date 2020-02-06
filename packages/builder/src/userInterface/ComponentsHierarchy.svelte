<script>
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"

  import { last, sortBy, map, trimCharsStart, trimChars, join } from "lodash/fp"

  import { pipe } from "../common/core"
  import { store } from "../builderStore"
  import { ArrowDownIcon } from "../common/Icons/"

  export let screens = []

  const joinPath = join("/")

  const normalizedName = name =>
    pipe(
      name,
      [
        trimCharsStart("./"),
        trimCharsStart("~/"),
        trimCharsStart("../"),
        trimChars(" "),
      ]
    )

  const lastPartOfName = c =>
    last(c.name ? c.name.split("/") : c._component.split("/"))

  const isComponentSelected = (current, comp) =>
    current === comp

  const isFolderSelected = (current, folder) => isInSubfolder(current, folder)

  $: _screens = pipe(
    screens,
    [map(c => ({ component: c, title: lastPartOfName(c) })), sortBy("title")]
  )

  $: console.log(_screens, $store.currentComponentInfo)

  const isScreenSelected = component =>
    component.component &&
    $store.currentPreviewItem &&
    component.component.name === $store.currentPreviewItem.name
</script>

<div class="root">

  {#each _screens as screen}
    <div
      class="hierarchy-item component"
      class:selected={$store.currentPreviewItem === screen}
      on:click|stopPropagation={() => store.setCurrentScreen(screen)}>

      <span
        class="icon"
        style="transform: rotate({$store.currentPreviewItem === screen ? 0 : -90}deg);">
        {#if screen.props._children}
          <ArrowDownIcon />
        {/if}
      </span>

      <span class="title">{screen.title}</span>
    </div>

    {#if $store.currentPreviewItem === screen && screen.props._children}
      <ComponentsHierarchyChildren
        components={screen.props._children}
        currentComponent={$store.currentComponentInfo}
        onSelect={$store.selectComponent} />
    {/if}
  {/each}

</div>

<style>
  .root {
    font-weight: 500;
    font-size: 0.9rem;
    color: #828fa5;
  }

  .hierarchy-item {
    cursor: pointer;
    padding: 11px 7px;
    margin: 5px 0;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }

  .hierarchy-item:hover {
    /* color: var(--secondary); */
    background: #fafafa;
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  }

  .title {
    margin-left: 10px;
  }

  .icon {
    display: inline-block;
    transition: 0.2s;
    width: 24px;
    height: 24px;
  }
</style>
