<script>
  import { Icon, Layout, Body } from "@budibase/bbui"
  import {
    store,
    sortedScreens,
    userSelectedResourceMap,
    screensHeight,
  } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import RoleIndicator from "./RoleIndicator.svelte"
  import DropdownMenu from "./DropdownMenu.svelte"
  import { onMount, tick } from "svelte"
  import { goto } from "@roxi/routify"

  let search = false
  let resizing = false
  let searchValue = ""
  let searchInput
  let container
  let screensContainer
  let scrolling = false
  let previousHeight = null
  let dragOffset

  $: filteredScreens = getFilteredScreens($sortedScreens, searchValue)

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const openSearch = async () => {
    search = true
    await tick()
    searchInput.focus()
    screensContainer.scroll({ top: 0, behavior: "smooth" })
    previousHeight = $screensHeight
    $screensHeight = "calc(100% + 1px)"
  }

  const closeSearch = async () => {
    if (previousHeight) {
      // Restore previous height and wait for animation
      $screensHeight = previousHeight
      previousHeight = null
      await sleep(300)
    }
    search = false
    searchValue = ""
  }

  const getFilteredScreens = (screens, search) => {
    return screens.filter(screen => {
      return !search || screen.routing.route.includes(search)
    })
  }

  const handleAddButton = () => {
    if (search) {
      closeSearch()
    } else {
      $goto("../new")
    }
  }

  const onKeyDown = e => {
    if (e.key === "Escape") {
      closeSearch()
    }
  }

  const handleScroll = e => {
    scrolling = e.target.scrollTop !== 0
  }

  const startResizing = e => {
    // Reset the height store to match the true height
    $screensHeight = `${container.getBoundingClientRect().height}px`

    // Store an offset to easily compute new height when moving the mouse
    dragOffset = parseInt($screensHeight) - e.clientY

    // Add event listeners
    resizing = true
    document.addEventListener("mousemove", resize)
    document.addEventListener("mouseup", stopResizing)
  }

  const resize = e => {
    // Prevent negative heights as this screws with layout
    const newHeight = Math.max(0, e.clientY + dragOffset)
    if (newHeight == null || isNaN(newHeight)) {
      return
    }
    $screensHeight = `${newHeight}px`
  }

  const stopResizing = () => {
    resizing = false
    document.removeEventListener("mousemove", resize)
  }

  onMount(() => {
    // Ensure we aren't stuck at 100% height from leaving while searching
    if ($screensHeight == null || isNaN(parseInt($screensHeight))) {
      $screensHeight = "210px"
    }
  })
</script>

<svelte:window on:keydown={onKeyDown} />
<div
  class="screens"
  class:search
  class:resizing
  style={`height:${$screensHeight};`}
  bind:this={container}
>
  <div class="header" class:scrolling>
    <input
      readonly={!search}
      bind:value={searchValue}
      bind:this={searchInput}
      class="input"
      placeholder="Search for screens"
    />
    <div class="title" class:hide={search}>
      <Body size="S">Screens</Body>
    </div>
    <div on:click={openSearch} class="searchButton" class:hide={search}>
      <Icon size="S" name="Search" />
    </div>
    <div
      on:click={handleAddButton}
      class="addButton"
      class:closeButton={search}
    >
      <Icon name="Add" />
    </div>
  </div>
  <div on:scroll={handleScroll} bind:this={screensContainer} class="content">
    {#if filteredScreens?.length}
      {#each filteredScreens as screen (screen._id)}
        <NavItem
          icon={screen.routing.homeScreen ? "Home" : null}
          indentLevel={0}
          selected={$store.selectedScreenId === screen._id}
          text={screen.routing.route}
          on:click={() => store.actions.screens.select(screen._id)}
          rightAlignIcon
          showTooltip
          selectedBy={$userSelectedResourceMap[screen._id]}
        >
          <DropdownMenu screenId={screen._id} />
          <div slot="icon" class="icon">
            <RoleIndicator roleId={screen.routing.roleId} />
          </div>
        </NavItem>
      {/each}
    {:else}
      <Layout paddingY="none" paddingX="L">
        <div class="no-results">
          There aren't any screens matching that route
        </div>
      </Layout>
    {/if}
  </div>

  <div
    class="divider"
    on:mousedown={startResizing}
    on:dblclick={() => screensHeight.set("210px")}
  />
</div>

<style>
  .screens {
    display: flex;
    flex-direction: column;
    min-height: 147px;
    max-height: calc(100% - 147px);
    position: relative;
  }
  .screens.search {
    transition: height 300ms ease-out;
    max-height: none;
  }
  .screens.resizing {
    user-select: none;
    cursor: row-resize;
  }

  .header {
    flex-shrink: 0;
    position: relative;
    height: 50px;
    box-sizing: border-box;
    padding: 0 var(--spacing-l);
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 130ms ease-out;
  }
  .header.scrolling {
    border-bottom: var(--border-light);
  }

  .input {
    font-family: var(--font-sans);
    position: absolute;
    color: var(--ink);
    background-color: transparent;
    border: none;
    font-size: var(--spectrum-alias-font-size-default);
    width: 260px;
    box-sizing: border-box;
    display: none;
  }
  .input:focus {
    outline: none;
  }
  .input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }
  .screens.search input {
    display: block;
  }

  .title {
    display: flex;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    flex: 1;
    opacity: 1;
    z-index: 1;
  }

  .content {
    overflow: auto;
    flex-grow: 1;
  }
  .screens.resizing .content {
    pointer-events: none;
  }

  .screens :global(.nav-item) {
    padding-right: 8px !important;
  }

  .searchButton {
    color: var(--grey-7);
    cursor: pointer;
    margin-right: 10px;
    opacity: 1;
  }
  .searchButton:hover {
    color: var(--ink);
  }

  .hide {
    opacity: 0;
    pointer-events: none;
  }

  .addButton {
    color: var(--grey-7);
    cursor: pointer;
    transition: transform 300ms ease-out;
  }
  .addButton:hover {
    color: var(--ink);
  }

  .closeButton {
    transform: rotate(45deg);
  }

  .icon {
    margin-left: 4px;
    margin-right: 4px;
  }

  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }

  .divider {
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
    height: 16px;
    width: 100%;
  }
  .divider:after {
    content: "";
    position: absolute;
    background: var(--spectrum-global-color-gray-200);
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    transition: background 130ms ease-out;
  }
  .divider:hover {
    cursor: row-resize;
  }
  .divider:hover:after {
    background: var(--spectrum-global-color-gray-300);
  }
</style>
