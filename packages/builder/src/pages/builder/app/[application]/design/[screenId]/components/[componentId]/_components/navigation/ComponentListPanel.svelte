<script>
  import Panel from "components/design/Panel.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import { dndStore } from "./dndStore.js"
  import { goto } from "@roxi/routify"
  import { store, selectedScreen } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenslotDropdownMenu from "./ScreenslotDropdownMenu.svelte"
  import { setContext } from "svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import { DropPosition } from "./dndStore"
  import { notifications, Button } from "@budibase/bbui"

  let scrollRef

  const scrollTo = bounds => {
    if (!bounds) {
      return
    }
    const sidebarWidth = 259
    const navItemHeight = 32
    const { scrollLeft, scrollTop, offsetHeight } = scrollRef
    let scrollBounds = scrollRef.getBoundingClientRect()
    let newOffsets = {}

    // Calculate left offset
    const offsetX = bounds.left + bounds.width + scrollLeft - 36
    if (offsetX > sidebarWidth) {
      newOffsets.left = offsetX - sidebarWidth
    } else {
      newOffsets.left = 0
    }
    if (newOffsets.left === scrollLeft) {
      delete newOffsets.left
    }

    // Calculate top offset
    const offsetY = bounds.top - scrollBounds?.top + scrollTop
    if (offsetY > scrollTop + offsetHeight - 2 * navItemHeight) {
      newOffsets.top = offsetY - offsetHeight + 2 * navItemHeight
    } else if (offsetY < scrollTop + navItemHeight) {
      newOffsets.top = offsetY - navItemHeight
    } else {
      delete newOffsets.top
    }

    // Skip if offset is unchanged
    if (newOffsets.left == null && newOffsets.top == null) {
      return
    }

    // Smoothly scroll to the offset
    scrollRef.scroll({
      ...newOffsets,
      behavior: "smooth",
    })
  }

  const onDrop = async () => {
    try {
      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving component")
    }
  }

  // Set scroll context so components can invoke scrolling when selected
  setContext("scroll", {
    scrollTo,
  })
</script>

<Panel title="Components" showExpandIcon borderRight>
  <div class="add-component">
    <Button on:click={() => $goto("./new")} cta>Add component</Button>
  </div>
  <div class="nav-items-container" bind:this={scrollRef}>
    <ul>
      <li
        on:click={() => {
          $store.selectedComponentId = $selectedScreen?.props._id
        }}
        id={`component-${$selectedScreen?.props._id}`}
      >
        <NavItem
          text="Screen"
          indentLevel={0}
          selected={$store.selectedComponentId === $selectedScreen?.props._id}
          opened
          scrollable
          icon="WebPage"
          on:drop={onDrop}
        >
          <ScreenslotDropdownMenu component={$selectedScreen?.props} />
        </NavItem>
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
  </div>
</Panel>

<style>
  .add-component {
    padding: var(--spacing-xl) var(--spacing-l);
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .nav-items-container {
    padding: var(--spacing-xl) 0;
    flex: 1 1 auto;
    overflow: auto;
    height: 0;
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
