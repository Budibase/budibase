<script lang="ts">
  import NavItem from "@/components/common/NavItem.svelte"
  import { Icon, notifications } from "@budibase/bbui"
  import type { Component } from "@budibase/types"
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

  interface ComponentWithId extends Component {
    _id: string
  }

  const hasComponentId = (component: Component): component is ComponentWithId => {
    return !!component._id
  }

  export let components: Component[] = []
  export let level = 0
  export let searchTerm = ""
  export let visibleSearchIds: Set<string> = new Set()
  export let matchingSearchIds: Set<string> = new Set()
  export let expandedSearchIds: Set<string> = new Set()

  $: isSearching = !!searchTerm

  $: filteredComponents = components?.filter(hasComponentId).filter(component => {
    const isCutComponent =
      $componentStore.componentToPaste?.isCut &&
      component._id === $componentStore.componentToPaste?._id

    const isVisibleInComponentTree =
      !isSearching || visibleSearchIds.has(component._id)

    return !isCutComponent && isVisibleInComponentTree
  })

  const dragover = (component: ComponentWithId) => (e: DragEvent) => {
    if (isSearching) {
      return false
    }

    const target = e.currentTarget as HTMLElement
    const mousePosition = e.offsetY / target.offsetHeight
    dndStore.actions.dragover({
      component,
      mousePosition,
    })
    return false
  }

  const getComponentIcon = (component: ComponentWithId) => {
    const def = componentStore.getDefinition(component?._component)
    return def?.icon
  }

  const componentSupportsChildren = (component: ComponentWithId) => {
    const def = componentStore.getDefinition(component?._component)
    return def?.hasChildren
  }

  const componentHasChildren = (component: ComponentWithId) => {
    return !!(componentSupportsChildren(component) && component._children?.length)
  }

  const onDrop = async (e: DragEvent) => {
    e.stopPropagation()
    if (isSearching) {
      return
    }

    try {
      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving component")
    }
  }

  const isOpen = (component: ComponentWithId) => {
    if (!component?._children?.length) {
      return false
    }
    if (isSearching) {
      return expandedSearchIds.has(component._id)
    }
    return componentTreeNodesStore.isNodeExpanded(component._id)
  }

  const selectComponent = (componentId: string) => {
    if (isSearching) {
      componentTreeNodesStore.makeNodeVisible(componentId)
    }
    componentStore.select(componentId)
  }

  const isChildOfSelectedComponent = (component: ComponentWithId) => {
    const selected = get(selectedComponent)
    const selectedComponentId = selected?._id
    const selectedScreenId = get(selectedScreen)?.props._id
    if (!selected || !selectedComponentId || selectedComponentId === selectedScreenId) {
      return false
    }
    return findComponentPath(selected, component._id)?.length > 0
  }

  const handleIconClick = (componentId: string) => {
    componentStore.select(componentId)
    if (isSearching) {
      componentTreeNodesStore.makeNodeVisible(componentId)
      componentTreeNodesStore.expandNodes([componentId])
      return
    }
    componentTreeNodesStore.toggleNode(componentId)
  }

  const hover = hoverStore.hover

  const openContextMenu = (
    e: MouseEvent,
    component: ComponentWithId,
    opened: boolean
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const items = getComponentContextMenuItems(
      component,
      !opened
    )
    contextMenuStore.open(component._id, items, { x: e.clientX, y: e.clientY })
  }

  let renamingId: string | null = null
  let renameValue = ""
  let renameInput: HTMLInputElement | undefined

  const startRename = async (component: ComponentWithId) => {
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

  const commitRename = async (component: ComponentWithId) => {
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
      await componentStore.patch((updated: Component) => {
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
    {@const opened = isOpen(component)}
    <li
      on:contextmenu={e => openContextMenu(e, component, opened)}
      on:dblclick|stopPropagation={() => startRename(component)}
      on:click|stopPropagation={() => {
        selectComponent(component._id)
      }}
      id={`component-${component._id}`}
    >
      <NavItem
        compact
        scrollable
        draggable={renamingId !== component._id && !isSearching}
        bodyInteractive={renamingId === component._id}
        on:dragend={dndStore.actions.reset}
        on:dragstart={() => {
          if (!isSearching) {
            dndStore.actions.dragstart(component)
          }
        }}
        on:dragover={dragover(component)}
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
              <span
                class:search-match={matchingSearchIds.has(component._id)}
                title={getComponentText(component)}
              >
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
          level={level + 1}
          {searchTerm}
          {visibleSearchIds}
          {matchingSearchIds}
          {expandedSearchIds}
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
  .search-match {
    background: var(--spectrum-global-color-yellow-1000);
    border-radius: 3px;
    color: var(--spectrum-global-color-static-gray-900);
    padding: 0 2px;
  }
</style>
