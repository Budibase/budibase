<script>
  import { store } from "builderStore"
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

  $: currentScreen = get(selectedScreen)

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

  const onDrop = async (e, component) => {
    e.stopPropagation()
    try {
      const compDef = store.actions.components.getDefinition(
        $dndStore.source?._component
      )
      const compTypeName = compDef.name.toLowerCase()
      const path = findComponentPath(currentScreen.props, component._id)

      for (let pathComp of path) {
        const pathCompDef = store.actions.components.getDefinition(
          pathComp?._component
        )
        if (pathCompDef?.illegalChildren?.indexOf(compTypeName) > -1) {
          notifications.warning(
            `${compDef.name} cannot be a child of ${pathCompDef.name} (${pathComp._instanceName})`
          )
          return
        }
      }

      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
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
  {#each filteredComponents || [] as component, index (component._id)}
    {@const opened = isOpen(component, $selectedComponentPath, closedNodes)}
    <li
      on:click|stopPropagation={() => {
        $store.selectedComponentId = component._id
      }}
      id={`component-${component._id}`}
    >
      <NavItem
        scrollable
        draggable
        on:dragend={dndStore.actions.reset}
        on:dragstart={() => dndStore.actions.dragstart(component)}
        on:dragover={dragover(component, index)}
        on:iconClick={() => toggleNodeOpen(component._id)}
        on:drop={e => {
          onDrop(e, component)
        }}
        text={getComponentText(component)}
        icon={getComponentIcon(component)}
        withArrow={componentHasChildren(component)}
        indentLevel={level + 1}
        selected={$store.selectedComponentId === component._id}
        {opened}
        highlighted={isChildOfSelectedComponent(component)}
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
