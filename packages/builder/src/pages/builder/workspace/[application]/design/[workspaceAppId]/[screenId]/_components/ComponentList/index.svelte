<script>
  import { tick } from "svelte"
  import { notifications, Icon } from "@budibase/bbui"
  import {
    selectedScreen,
    screenStore,
    componentStore,
    userSelectedResourceMap,
    hoverStore,
    contextMenuStore,
    componentTreeNodesStore,
  } from "@/stores/builder"
  import NavItem from "@/components/common/NavItem.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import { dndStore, DropPosition } from "./dndStore.js"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import ComponentScrollWrapper from "./ComponentScrollWrapper.svelte"
  import getScreenContextMenuItems from "./getScreenContextMenuItems"
  import { getComponentTreeSearchResults } from "@/helpers/components"

  $: screenComponentId = `${$screenStore.selectedScreenId}-screen`
  $: navComponentId = `${$screenStore.selectedScreenId}-navigation`
  let searchTerm = ""
  let searchOpen = false
  let searchInput

  $: isSearching = !!searchTerm.trim()
  $: searchResults = getComponentTreeSearchResults(
    $selectedScreen?.props?._children,
    searchTerm
  )

  const openSearch = async () => {
    searchOpen = true
    await tick()
    searchInput?.focus()
  }

  const closeSearch = () => {
    searchOpen = false
    searchTerm = ""
  }

  const toggleSearch = () => {
    if (searchOpen) {
      closeSearch()
      return
    }
    openSearch()
  }

  const onKeyDown = e => {
    if (e.key === "Escape" && searchOpen) {
      closeSearch()
    }
  }

  const onSearchInputKeyDown = e => {
    if (e.key === "Escape") {
      closeSearch()
      return
    }

    if (e.key !== "Enter") {
      return
    }

    const [componentId] = searchResults.matchingIds
    if (!componentId) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    componentTreeNodesStore.makeNodeVisible(componentId)
    componentStore.select(componentId)
  }

  const onDrop = async () => {
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

  const hover = hoverStore.hover

  // showCopy is used to hide the copy button when the user right-clicks the empty
  // background of their component tree. Pasting in the empty space makes sense,
  // but copying it doesn't
  const openScreenContextMenu = (e, showCopy) => {
    const screenComponent = $selectedScreen?.props
    const definition = componentStore.getDefinition(screenComponent?._component)
    // "editable" has been repurposed for inline text editing.
    // It remains here for legacy compatibility.
    // Future components should define "static": true for indicate they should
    // not show a context menu.
    if (definition?.editable !== false && definition?.static !== true) {
      e.preventDefault()
      e.stopPropagation()

      const items = getScreenContextMenuItems(screenComponent, showCopy)
      contextMenuStore.open(
        `${showCopy ? "background-" : ""}screenComponent._id`,
        items,
        {
          x: e.clientX,
          y: e.clientY,
        }
      )
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="components">
  <div class="list-panel">
    <ComponentScrollWrapper>
      <ul
        class="componentTree"
        on:contextmenu={e => openScreenContextMenu(e, false)}
      >
        <li on:contextmenu={e => openScreenContextMenu(e, true)}>
          <NavItem
            text="Screen"
            indentLevel={0}
            selected={$componentStore.selectedComponentId ===
              `${$screenStore.selectedScreenId}-screen`}
            opened
            scrollable
            icon="browser"
            bodyInteractive={searchOpen}
            on:drop={onDrop}
            on:click={() => {
              componentStore.select(`${$screenStore.selectedScreenId}-screen`)
            }}
            hovering={$hoverStore.componentId === screenComponentId ||
              $selectedScreen?.props._id === $contextMenuStore.id}
            on:mouseenter={() => hover(screenComponentId)}
            on:mouseleave={() => hover(null)}
            id="component-screen"
            selectedBy={searchOpen
              ? null
              : $userSelectedResourceMap[screenComponentId]}
          >
            <svelte:fragment slot="text">
              {#if searchOpen}
                <input
                  class="screen-search-input"
                  placeholder="Search components"
                  bind:value={searchTerm}
                  bind:this={searchInput}
                  on:click|stopPropagation
                  on:dblclick|stopPropagation
                  on:contextmenu|stopPropagation
                  on:keydown={onSearchInputKeyDown}
                />
              {:else}
                <div class="screen-row-text">
                  <span title="Screen">Screen</span>
                </div>
              {/if}
            </svelte:fragment>
            {#if !searchOpen}
              <Icon
                size="S"
                hoverable
                name="dots-three"
                on:click={e =>
                  openScreenContextMenu(e, $selectedScreen?.props)}
              />
            {/if}
            <svelte:fragment slot="right">
              <button
                class="screen-search-toggle"
                type="button"
                aria-label={searchOpen
                  ? "Close component search"
                  : "Search components"}
                on:click|stopPropagation={toggleSearch}
              >
                <Icon
                  size="S"
                  hoverable
                  name={searchOpen ? "x" : "magnifying-glass"}
                />
              </button>
            </svelte:fragment>
          </NavItem>
        </li>
        <li on:contextmenu|stopPropagation>
          <NavItem
            text="Navigation"
            indentLevel={0}
            selected={$componentStore.selectedComponentId === navComponentId}
            opened
            scrollable
            icon={$selectedScreen?.showNavigation ? "eye" : "eye-slash"}
            on:drop={onDrop}
            on:click={() => {
              componentStore.select(
                `${$screenStore.selectedScreenId}-navigation`
              )
            }}
            hovering={$hoverStore.componentId === navComponentId}
            on:mouseenter={() => hover(navComponentId)}
            on:mouseleave={() => hover(null)}
            id="component-nav"
            selectedBy={$userSelectedResourceMap[navComponentId]}
          />
          <ComponentTree
            level={0}
            components={$selectedScreen?.props._children}
            searchTerm={searchTerm.trim()}
            visibleSearchIds={searchResults.visibleIds}
            matchingSearchIds={searchResults.matchingIds}
            expandedSearchIds={searchResults.expandedIds}
          />
          {#if isSearching && searchResults.matchingIds.size === 0}
            <div class="no-results">No components found</div>
          {/if}

          <!-- Show drop indicators for the target and the parent -->
          {#if !isSearching && $dndStore.dragging && $dndStore.valid}
            <DNDPositionIndicator
              component={$dndStore.target}
              position={$dndStore.dropPosition}
            />
            {#if $dndStore.dropPosition !== DropPosition.INSIDE}
              <DNDPositionIndicator
                component={$dndStore.targetParent}
                position={DropPosition.INSIDE}
              />
            {/if}
          {/if}
        </li>
      </ul>
    </ComponentScrollWrapper>
  </div>
</div>

<style>
  .components {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top: var(--spacing-l);
  }

  .components :global(.nav-item) {
    padding-right: 8px !important;
  }

  .list-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .no-results {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--spectrum-global-dimension-font-size-100);
    padding: var(--spacing-s) var(--spacing-xl);
  }

  .screen-row-text {
    overflow: hidden;
  }

  .screen-row-text span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .screen-search-input {
    width: 100%;
    min-width: 120px;
    border: none;
    color: var(--ink);
    background: transparent;
    font: inherit;
    outline: none;
  }

  .screen-search-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .screen-search-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: var(--grey-7);
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  .screen-search-toggle:hover {
    color: var(--ink);
  }

  .componentTree {
    min-height: 100%;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    position: relative;
  }
  ul,
  li {
    min-width: max-content;
  }
</style>
