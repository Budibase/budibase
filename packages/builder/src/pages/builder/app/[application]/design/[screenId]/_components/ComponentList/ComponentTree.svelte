<script>
  import { store, userSelectedResourceMap } from "builderStore"
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
  import { dndStore } from "./dndStore"

  export let components = []
  export let level = 0

  let closedNodes = {}

  $: filteredComponents = components?.filter(component => {
    return (
      !$store.componentToPaste?.isCut ||
      component._id !== $store.componentToPaste?._id
    )
  })

  const dragover = (component, index) => e => {
    const mousePosition = e.offsetY / e.currentTarget.offsetHeight
    dndStore.actions.dragover({
      component,
      index,
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

  const componentSupportsChildren = component => {
    const def = store.actions.components.getDefinition(component?._component)
    return def?.hasChildren
  }

  const componentHasChildren = component => {
    return componentSupportsChildren(component) && component._children?.length
  }

  function toggleNodeOpen(componentId) {
    if (closedNodes[componentId]) {
      delete closedNodes[componentId]
    } else {
      closedNodes[componentId] = true
    }
    closedNodes = closedNodes
  }

  const onDrop = async e => {
    e.stopPropagation()
    try {
      await dndStore.actions.drop()
    } catch (error) {
      notifications.error(error || "Error saving component")
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
  {#each filteredComponents || [] as component, index (component._id)}
    {@const opened = isOpen(component, $selectedComponentPath, closedNodes)}
    <li
      on:click|stopPropagation={() => {
        $store.selectedComponentId = component._id
      }}
      id={`component-${component._id}`}
    >
      <NavItem
        compact
        scrollable
        draggable
        on:dragend={dndStore.actions.reset}
        on:dragstart={() => dndStore.actions.dragstart(component)}
        on:dragover={dragover(component, index)}
        on:iconClick={() => toggleNodeOpen(component._id)}
        on:drop={onDrop}
        text={getComponentText(component)}
        icon={getComponentIcon(component)}
        withArrow={componentHasChildren(component)}
        indentLevel={level}
        selected={$store.selectedComponentId === component._id}
        {opened}
        highlighted={isChildOfSelectedComponent(component)}
        selectedBy={$userSelectedResourceMap[component._id]}
      >
        <ComponentDropdownMenu {component} />
      </NavItem>
      {#if opened}
        <svelte:self
          components={component._children}
          {dndStore}
          level={level + 1}
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
</style>
