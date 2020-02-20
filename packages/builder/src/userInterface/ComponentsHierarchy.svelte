<script>
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"

  import { last, sortBy, map, trimCharsStart, trimChars, join } from "lodash/fp"
  import ConfirmDialog from "../common/ConfirmDialog.svelte"
  import { pipe } from "../common/core"
  import { store } from "../builderStore"
  import { ArrowDownIcon, ShapeIcon } from "../common/Icons/"

  export let screens = []

  let confirmDeleteDialog
  let componentToDelete = ""

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
    c && last(c.name ? c.name.split("/") : c._component.split("/"))

  const isComponentSelected = (current, comp) => current === comp

  const isFolderSelected = (current, folder) => isInSubfolder(current, folder)

  $: _screens = pipe(
    screens,
    [map(c => ({ component: c, title: lastPartOfName(c) })), sortBy("title")]
  )

  const isScreenSelected = component =>
    component.component &&
    $store.currentPreviewItem &&
    component.component.name === $store.currentPreviewItem.name

  const confirmDeleteComponent = component => {
    componentToDelete = component
    confirmDeleteDialog.show()
  }
</script>

<div class="root">

  {#each _screens as screen}
    <div
      class="hierarchy-item component"
      class:selected={$store.currentComponentInfo._id === screen.component.props._id}
      on:click|stopPropagation={() => store.setCurrentScreen(screen.title)}>

      <span
        class="icon"
        class:rotate={$store.currentPreviewItem.name !== screen.title}>
        {#if screen.component.props._children.length}
          <ArrowDownIcon />
        {/if}
      </span>

      <span class="icon">
        <ShapeIcon />
      </span>

      <span class="title">{screen.title}</span>
    </div>

    {#if $store.currentPreviewItem.name === screen.title && screen.component.props._children}
      <ComponentsHierarchyChildren
        components={screen.component.props._children}
        currentComponent={$store.currentComponentInfo}
        onSelect={store.selectComponent}
        onDeleteComponent={confirmDeleteComponent}
        onMoveUpComponent={store.moveUpComponent}
        onMoveDownComponent={store.moveDownComponent}
        onCopyComponent={store.copyComponent} />
    {/if}
  {/each}

</div>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete this '${lastPartOfName(componentToDelete._component)}' component`}
  okText="Delete Component"
  onOk={() => store.deleteComponent(componentToDelete)} />

<style>
  .root {
    font-weight: 400;
    font-size: 0.8rem;
    color: #333;
  }

  .hierarchy-item {
    cursor: pointer;
    padding: 0 7px 0 3px;
    height: 35px;
    margin: 5px 0;
    border-radius: 0 5px 5px 0;
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  .hierarchy-item:hover {
    background: #fafafa;
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  }

  .title {
    margin-left: 10px;
    margin-top: 2px;
  }

  .icon {
    display: inline-block;
    transition: 0.2s;
    width: 20px;
    margin-top: 2px;
    color: #333;
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
