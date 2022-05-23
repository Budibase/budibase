<script>
  import Panel from "components/design/Panel.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import createDNDStore from "./dndStore.js"
  import { goto } from "@roxi/routify"
  import { store, selectedScreen } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenslotDropdownMenu from "./ScreenslotDropdownMenu.svelte"
  import { setContext } from "svelte"

  const dndStore = createDNDStore()
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
    const offsetX = bounds.left + bounds.width + scrollLeft - 58
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

<Panel
  title="Components"
  showAddButton
  onClickAddButton={() => $goto("../new")}
  showExpandIcon
  borderRight
>
  <div class="nav-items-container" bind:this={scrollRef}>
    <NavItem
      text="Screen"
      indentLevel={0}
      selected={$store.selectedComponentId === $selectedScreen?.props._id}
      opened
      scrollable
      icon="WebPage"
      on:click={() => {
        $store.selectedComponentId = $selectedScreen?.props._id
      }}
    >
      <ScreenslotDropdownMenu component={$selectedScreen?.props} />
    </NavItem>
    <ComponentTree
      level={0}
      components={$selectedScreen?.props._children}
      {dndStore}
    />
  </div>
</Panel>

<style>
  .nav-items-container {
    padding: var(--spacing-xl) 0;
    flex: 1 1 auto;
    overflow: auto;
    height: 0;
    position: relative;
  }
</style>
