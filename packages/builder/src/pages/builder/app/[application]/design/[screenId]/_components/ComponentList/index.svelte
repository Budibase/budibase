<script>
  import { notifications, Icon, Body } from "@budibase/bbui"
  import { isActive, goto } from "@roxi/routify"
  import {
    selectedScreen,
    screenStore,
    componentStore,
    userSelectedResourceMap,
    hoverStore,
    contextMenuStore,
  } from "@/stores/builder"
  import NavItem from "@/components/common/NavItem.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import { dndStore, DropPosition } from "./dndStore.js"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import ComponentKeyHandler from "./ComponentKeyHandler.svelte"
  import ComponentScrollWrapper from "./ComponentScrollWrapper.svelte"
  import getScreenContextMenuItems from "./getScreenContextMenuItems"

  let scrolling = false

  $: screenComponentId = `${$screenStore.selectedScreenId}-screen`
  $: navComponentId = `${$screenStore.selectedScreenId}-navigation`

  const toNewComponentRoute = () => {
    if ($isActive(`./:componentId/new`)) {
      $goto(`./:componentId`)
    } else {
      $goto(`./:componentId/new`)
    }
  }

  const onDrop = async () => {
    try {
      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving component")
    }
  }

  const handleScroll = e => {
    scrolling = e.target.scrollTop !== 0
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="components">
  <div class="header" class:scrolling>
    <Body size="S">Components</Body>
    <div on:click={toNewComponentRoute} class="addButton">
      <Icon name="Add" />
    </div>
  </div>
  <div class="list-panel">
    <ComponentScrollWrapper on:scroll={handleScroll}>
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
            icon="WebPage"
            on:drop={onDrop}
            on:click={() => {
              componentStore.select(`${$screenStore.selectedScreenId}-screen`)
            }}
            hovering={$hoverStore.componentId === screenComponentId ||
              $selectedScreen?.props._id === $contextMenuStore.id}
            on:mouseenter={() => hover(screenComponentId)}
            on:mouseleave={() => hover(null)}
            id="component-screen"
            selectedBy={$userSelectedResourceMap[screenComponentId]}
          >
            <Icon
              size="S"
              hoverable
              name="MoreSmallList"
              on:click={e => openScreenContextMenu(e, $selectedScreen?.props)}
            />
          </NavItem>
        </li>
        <li on:contextmenu|stopPropagation>
          <NavItem
            text="Navigation"
            indentLevel={0}
            selected={$componentStore.selectedComponentId === navComponentId}
            opened
            scrollable
            icon={$selectedScreen?.showNavigation
              ? "Visibility"
              : "VisibilityOff"}
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
          />

          <!-- Show drop indicators for the target and the parent -->
          {#if $dndStore.dragging && $dndStore.valid}
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
  <ComponentKeyHandler />
</div>

<style>
  .components {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .header {
    height: 50px;
    box-sizing: border-box;
    padding: var(--spacing-l);
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 130ms ease-out;
  }
  .header.scrolling {
    border-bottom: var(--border-light);
  }

  .components :global(.nav-item) {
    padding-right: 8px !important;
  }

  .addButton {
    margin-left: auto;
    color: var(--grey-7);
    cursor: pointer;
  }

  .addButton:hover {
    color: var(--ink);
  }

  .list-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
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
