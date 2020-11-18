<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import { last } from "lodash/fp"
  import { DropEffect, DropPosition } from "./dragDropStore"
  import ComponentDropdownMenu from "../ComponentDropdownMenu.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { getComponentDefinition } from "builderStore/storeUtils"

  export let components = []
  export let currentComponent
  export let onSelect = () => {}
  export let level = 0

  export let dragDropStore

  const isScreenslot = name => name === "##builtin/screenslot"

  const selectComponent = component => {
    // Set current component
    store.actions.components.select(component)

    // Get ID path
    const path = store.actions.components.findRoute(component)

    // Go to correct URL
    $goto(`./:page/:screen/${path}`)
  }

  const dragstart = component => e => {
    e.dataTransfer.dropEffect = DropEffect.MOVE
    dragDropStore.actions.dragstart(component)
  }

  const dragover = (component, index) => e => {
    const canHaveChildrenButIsEmpty =
      getComponentDefinition($store, component._component).children &&
      component._children.length === 0

    e.dataTransfer.dropEffect = DropEffect.COPY

    // how far down the mouse pointer is on the drop target
    const mousePosition = e.offsetY / e.currentTarget.offsetHeight

    dragDropStore.actions.dragover({
      component,
      index,
      canHaveChildrenButIsEmpty,
      mousePosition,
    })

    return false
  }
</script>

<ul>
  {#each components as component, index (component._id)}
    <li on:click|stopPropagation={() => selectComponent(component)}>
      {#if $dragDropStore && $dragDropStore.targetComponent === component && $dragDropStore.dropPosition === DropPosition.ABOVE}
        <div
          on:drop={dragDropStore.actions.drop}
          ondragover="return false"
          ondragenter="return false"
          class="drop-item"
          style="margin-left: {(level + 1) * 16}px" />
      {/if}

      <NavItem
        draggable
        on:dragend={dragDropStore.actions.reset}
        on:dragstart={dragstart(component)}
        on:dragover={dragover(component, index)}
        on:drop={dragDropStore.actions.drop}
        text={isScreenslot(component._component) ? 'Screenslot' : component._instanceName}
        withArrow
        indentLevel={level + 3}
        selected={currentComponent === component}>
        <ComponentDropdownMenu {component} />
      </NavItem>

      {#if component._children}
        <svelte:self
          components={component._children}
          {currentComponent}
          {onSelect}
          {dragDropStore}
          level={level + 1} />
      {/if}

      {#if $dragDropStore && $dragDropStore.targetComponent === component && ($dragDropStore.dropPosition === DropPosition.INSIDE || $dragDropStore.dropPosition === DropPosition.BELOW)}
        <div
          on:drop={dragDropStore.actions.drop}
          ondragover="return false"
          ondragenter="return false"
          class="drop-item"
          style="margin-left: {(level + ($dragDropStore.dropPosition === DropPosition.INSIDE ? 3 : 1)) * 16}px" />
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  .drop-item {
    border-radius: var(--border-radius-m);
    height: 32px;
    background: var(--grey-3);
  }
</style>
