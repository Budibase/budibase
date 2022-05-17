<script>
  import { store } from "builderStore"
  import { DropEffect, DropPosition } from "./dragDropStore"
  import ComponentDropdownMenu from "./ComponentDropdownMenu.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { capitalise } from "helpers"
  import { notifications } from "@budibase/bbui"
  import {
    selectedComponentPath,
    selectedComponent,
    selectedScreen,
  } from "builderStore"
  import { findComponentPath } from "builderStore/componentUtils"
  import { get } from "svelte/store"

  export let components = []
  export let currentComponent
  export let level = 0
  export let dragDropStore

  let closedNodes = {}

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

  const getComponentIcon = component => {
    const def = store.actions.components.getDefinition(component?._component)
    return def?.icon
  }

  const componentHasChildren = component => {
    const def = store.actions.components.getDefinition(component?._component)
    return def?.hasChildren && component._children?.length
  }

  function toggleNodeOpen(componentId) {
    if (closedNodes[componentId]) {
      delete closedNodes[componentId]
    } else {
      closedNodes[componentId] = true
    }
    closedNodes = closedNodes
  }

  const onDrop = async () => {
    try {
      await dragDropStore.actions.drop()
    } catch (error) {
      notifications.error("Error saving component")
    }
  }

  const isOpen = (component, selectedComponentPath, closedNodes) => {
    if (!component?._children?.length) {
      return false
    }
    if (selectedComponentPath.includes(component._id)) {
      return true
    }
    return !closedNodes[component._id]
  }

  const isChildOfSelectedComponent = component => {
    const selectedComponentId = get(selectedComponent)?._id
    const selectedScreenId = get(selectedScreen)?.props._id
    if (!selectedComponentId || selectedComponentId === selectedScreenId) {
      return false
    }
    return findComponentPath($selectedComponent, component._id)?.length > 0
  }
</script>

<ul>
  {#each components || [] as component, index (component._id)}
    <li
      on:click|stopPropagation={() => {
        $store.selectedComponentId = component._id
      }}
    >
      {#if $dragDropStore?.targetComponent === component && $dragDropStore.dropPosition === DropPosition.ABOVE}
        <div
          on:drop={onDrop}
          ondragover="return false"
          ondragenter="return false"
          class="drop-item"
          style="margin-left: {(level + 1) * 16}px"
        />
      {/if}

      <NavItem
        scrollable
        draggable
        on:dragend={dragDropStore.actions.reset}
        on:dragstart={dragstart(component)}
        on:dragover={dragover(component, index)}
        on:iconClick={() => toggleNodeOpen(component._id)}
        on:drop={onDrop}
        text={getComponentText(component)}
        icon={getComponentIcon(component)}
        withArrow={componentHasChildren(component)}
        indentLevel={level + 1}
        selected={$store.selectedComponentId === component._id}
        opened={isOpen(component, $selectedComponentPath, closedNodes)}
        highlighted={isChildOfSelectedComponent(component)}
      >
        <ComponentDropdownMenu {component} />
      </NavItem>

      {#if isOpen(component, $selectedComponentPath, closedNodes)}
        <svelte:self
          components={component._children}
          {currentComponent}
          {dragDropStore}
          level={level + 1}
        />
      {/if}

      {#if $dragDropStore?.targetComponent === component && ($dragDropStore.dropPosition === DropPosition.INSIDE || $dragDropStore.dropPosition === DropPosition.BELOW)}
        <div
          on:drop={onDrop}
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
  ul :global(.icon.arrow) {
    transition: opacity 130ms ease-out;
    opacity: 0;
  }
  ul:hover :global(.icon.arrow) {
    opacity: 1;
  }
  ul,
  li {
    min-width: max-content;
  }

  .drop-item {
    border-radius: var(--border-radius-m);
    height: 32px;
    background: var(--grey-3);
  }
</style>
