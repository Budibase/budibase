<script>
  import NavItem from "@/components/common/NavItem.svelte"
  import { Icon, notifications } from "@budibase/bbui"
  import {
    selectedScreen,
    componentStore,
    userSelectedResourceMap,
    selectedComponent,
    hoverStore,
    componentTreeNodesStore,
    contextMenuStore,
  } from "@/stores/builder"
  import {
    findComponentPath,
    getComponentText,
    getComponentName,
  } from "@/helpers/components"
  import { get } from "svelte/store"
  import { dndStore } from "./dndStore"
  import getComponentContextMenuItems from "./getComponentContextMenuItems"

  export let components = []
  export let level = 0

  $: openNodes = $componentTreeNodesStore

  $: filteredComponents = components?.filter(component => {
    return (
      !$componentStore.componentToPaste?.isCut ||
      component._id !== $componentStore.componentToPaste?._id
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

  const getComponentIcon = component => {
    const def = componentStore.getDefinition(component?._component)
    return def?.icon
  }

  const componentSupportsChildren = component => {
    const def = componentStore.getDefinition(component?._component)
    return def?.hasChildren
  }

  const componentHasChildren = component => {
    return componentSupportsChildren(component) && component._children?.length
  }

  const onDrop = async e => {
    e.stopPropagation()
    try {
      await dndStore.actions.drop()
    } catch (error) {
      notifications.error(error || "Error saving component")
    }
  }

  const isOpen = component => {
    if (!component?._children?.length) {
      return false
    }
    return componentTreeNodesStore.isNodeExpanded(component._id)
  }

  const isChildOfSelectedComponent = component => {
    const selectedComponentId = get(selectedComponent)?._id
    const selectedScreenId = get(selectedScreen)?.props._id
    if (!selectedComponentId || selectedComponentId === selectedScreenId) {
      return false
    }
    return findComponentPath($selectedComponent, component._id)?.length > 0
  }

  const handleIconClick = componentId => {
    componentStore.select(componentId)
    componentTreeNodesStore.toggleNode(componentId)
  }

  const hover = hoverStore.hover

  const openContextMenu = (e, component, opened) => {
    e.preventDefault()
    e.stopPropagation()

    const items = getComponentContextMenuItems(
      component,
      !opened,
      componentStore
    )
    contextMenuStore.open(component._id, items, { x: e.clientX, y: e.clientY })
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ul>
  {#each filteredComponents || [] as component, index (component._id)}
    {@const opened = isOpen(component, openNodes)}
    <li
      on:contextmenu={e => openContextMenu(e, component, opened)}
      on:click|stopPropagation={() => {
        componentStore.select(component._id)
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
        on:iconClick={() => handleIconClick(component._id)}
        on:drop={onDrop}
        hovering={$hoverStore.componentId === component._id ||
          component._id === $contextMenuStore.id}
        on:mouseenter={() => hover(component._id)}
        on:mouseleave={() => hover(null)}
        text={getComponentText(component)}
        icon={getComponentIcon(component)}
        iconTooltip={getComponentName(component)}
        withArrow={componentHasChildren(component)}
        indentLevel={level}
        selected={$componentStore.selectedComponentId === component._id}
        {opened}
        highlighted={isChildOfSelectedComponent(component)}
        selectedBy={$userSelectedResourceMap[component._id]}
      >
        <Icon
          size="S"
          hoverable
          name="MoreSmallList"
          on:click={e => openContextMenu(e, component, opened)}
        />
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
  ul,
  li {
    min-width: max-content;
  }
</style>
