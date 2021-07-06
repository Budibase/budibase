<script>
  import { store } from "builderStore"
  import { DropEffect, DropPosition } from "./dragDropStore"
  import ComponentDropdownMenu from "../ComponentDropdownMenu.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { capitalise } from "helpers"

  export let components = []
  export let currentComponent
  export let onSelect = () => {}
  export let level = 0
  export let dragDropStore

  const selectComponent = component => {
    store.actions.components.select(component)
  }

  const dragstart = component => e => {
    e.dataTransfer.dropEffect = DropEffect.MOVE
    dragDropStore.actions.dragstart(component)
  }

  const dragover = (component, index) => e => {
    const definition = store.actions.components.getDefinition(
      component._component
    )
    const canHaveChildrenButIsEmpty =
      definition?.hasChildren && !component._children?.length

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

  const getComponentText = component => {
    if (component._instanceName) {
      return component._instanceName
    }
    const type =
      component._component.replace("@budibase/standard-components/", "") ||
      "component"
    return capitalise(type)
  }
</script>

<ul>
  {#each components as component, index (component._id)}
    <li on:click|stopPropagation={() => selectComponent(component)}>
      {#if $dragDropStore?.targetComponent === component && $dragDropStore.dropPosition === DropPosition.ABOVE}
        <div
          on:drop={dragDropStore.actions.drop}
          ondragover="return false"
          ondragenter="return false"
          class="drop-item"
          style="margin-left: {(level + 1) * 16}px"
        />
      {/if}

      <NavItem
        draggable
        on:dragend={dragDropStore.actions.reset}
        on:dragstart={dragstart(component)}
        on:dragover={dragover(component, index)}
        on:drop={dragDropStore.actions.drop}
        text={getComponentText(component)}
        withArrow
        indentLevel={level + 1}
        selected={$store.selectedComponentId === component._id}
      >
        <ComponentDropdownMenu {component} />
      </NavItem>

      {#if component._children}
        <svelte:self
          components={component._children}
          {currentComponent}
          {onSelect}
          {dragDropStore}
          level={level + 1}
        />
      {/if}

      {#if $dragDropStore?.targetComponent === component && ($dragDropStore.dropPosition === DropPosition.INSIDE || $dragDropStore.dropPosition === DropPosition.BELOW)}
        <div
          on:drop={dragDropStore.actions.drop}
          ondragover="return false"
          ondragenter="return false"
          class="drop-item"
          style="margin-left: {(level +
            ($dragDropStore.dropPosition === DropPosition.INSIDE ? 3 : 1)) *
            16}px"
        />
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
