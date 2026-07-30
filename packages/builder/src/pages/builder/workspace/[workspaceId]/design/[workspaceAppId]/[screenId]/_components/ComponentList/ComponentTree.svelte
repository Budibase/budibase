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
  import { tick } from "svelte"
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

  let renamingId = null
  let renameValue = ""
  let renameInput

  const startRename = async component => {
    renamingId = component._id
    renameValue = component?._instanceName || getComponentText(component)
    await tick()
    renameInput?.focus()
    renameInput?.select()
  }

  const cancelRename = () => {
    renamingId = null
    renameValue = ""
  }

  const commitRename = async component => {
    const trimmed = renameValue.trim()
    renamingId = null
    if (!trimmed) {
      return
    }
    const current = component?._instanceName || ""
    const defaultText = getComponentText(component)
    if (trimmed === current || (current === "" && trimmed === defaultText)) {
      return
    }
    try {
      await componentStore.patch(updated => {
        updated._instanceName = trimmed
        return true
      }, component._id)
    } catch (error) {
      console.error(error)
      notifications.error("Error renaming component")
    }
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ul>
  {#each filteredComponents || [] as component, index (component._id)}
    {@const opened = isOpen(component, openNodes)}
    <li
      on:contextmenu={e => openContextMenu(e, component, opened)}
      on:dblclick|stopPropagation={() => startRename(component)}
      on:click|stopPropagation={() => {
        componentStore.select(component._id)
      }}
      id={`component-${component._id}`}
    >
      <NavItem
        compact
        scrollable
        draggable={renamingId !== component._id}
        bodyInteractive={renamingId === component._id}
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
        <svelte:fragment slot="text">
          {#if renamingId === component._id}
            <input
              class="rename-input"
              bind:this={renameInput}
              bind:value={renameValue}
              on:click|stopPropagation
              on:keydown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  commitRename(component)
                }
                if (e.key === "Escape") {
                  e.preventDefault()
                  cancelRename()
                }
              }}
              on:blur={() => commitRename(component)}
            />
          {:else}
            <div class="text">
              <span title={getComponentText(component)}>
                {getComponentText(component)}
              </span>
            </div>
          {/if}
        </svelte:fragment>
        <Icon
          size="M"
          hoverable
          name="dots-three"
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
  .rename-input {
    width: 100%;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 2px;
    padding: 2px 6px;
    font: inherit;
    color: inherit;
    background: var(--spectrum-global-color-gray-50);
  }
  .rename-input:focus {
    outline: none;
    border-color: var(--spectrum-global-color-gray-600);
    background: var(--spectrum-global-color-gray-100);
  }
</style>
