<script>
  import NavigationPanel from "components/design/navigation/NavigationPanel.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import instantiateStore from "./dragDropStore.js"
  import { goto } from "@roxi/routify"
  import { store, selectedScreen, selectedComponent } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenslotDropdownMenu from "./ScreenslotDropdownMenu.svelte"
  import { setContext } from "svelte"

  const dragDropStore = instantiateStore()
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
    const offsetX = bounds.left + bounds.width + scrollLeft - 40
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

  // Set scroll context so components can invoke scrolling when selected
  setContext("scroll", {
    scrollTo,
  })
</script>

<NavigationPanel
  title="Components"
  showAddButton
  onClickAddButton={() => $goto("../new")}
  showExpandIcon
>
  <div class="nav-items-container" bind:this={scrollRef}>
    <NavItem
      text="Screen"
      withArrow
      indentLevel={0}
      selected={$store.selectedComponentId === $selectedScreen?.props._id}
      opened
      scrollable
      on:click={() => {
        $store.selectedComponentId = $selectedScreen?.props._id
      }}
    >
      <ScreenslotDropdownMenu component={$selectedScreen?.props} />
    </NavItem>
    <ComponentTree
      level={0}
      components={$selectedScreen?.props._children}
      currentComponent={$selectedComponent}
      {dragDropStore}
    />
  </div>
</NavigationPanel>

<style>
  .nav-items-container {
    margin: 0 calc(-1 * var(--spacing-l));
    padding: var(--spacing-xl) var(--spacing-l);
    flex: 1 1 auto;
    overflow: auto;
    height: 0;
    position: relative;
  }
</style>
