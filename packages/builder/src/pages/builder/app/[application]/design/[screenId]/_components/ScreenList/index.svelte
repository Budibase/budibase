<script>
  import { Icon, Layout, Body } from "@budibase/bbui"
  import {
    store,
    sortedScreens,
    userSelectedResourceMap,
  } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import RoleIndicator from "./RoleIndicator.svelte"
  import DropdownMenu from "./DropdownMenu.svelte"
  import { goto } from "@roxi/routify"
  import { getVerticalResizeActions } from './resizable';
  import { tick } from "svelte"

  const [resizable, resizableHandle] = getVerticalResizeActions();

  let searching = false
  let resizing = false
  let searchValue = ""
  let searchInput
  let screensContainer
  let scrolling = false

  $: filteredScreens = getFilteredScreens($sortedScreens, searchValue)

  const openSearch = async () => {
    searching = true
    await tick()
    searchInput.focus()
    screensContainer.scroll({ top: 0, behavior: "smooth" })
  }

  const closeSearch = async () => {
    searching = false
    searchValue = ""
  }

  const getFilteredScreens = (screens, searchValue) => {
    return screens.filter(screen => {
      return !searchValue || screen.routing.route.includes(searchValue)
    })
  }

  const handleAddButton = () => {
    if (searching) {
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

</script>

<svelte:window on:keydown={onKeyDown} />
<div
  class="screens"
  class:searching
  class:resizing
  use:resizable
>
  <div class="header" class:scrolling>
    <input
      readonly={!searching}
      bind:value={searchValue}
      bind:this={searchInput}
      class="input"
      placeholder="Search for screens"
    />
    <div on:click={openSearch} class="title" class:hide={searching}>
      <Body size="S">Screens</Body>
    </div>
    <div on:click={openSearch} class="searchButton" class:hide={searching}>
      <Icon size="S" name="Search" />
    </div>
    <div
      on:click={handleAddButton}
      class="addButton"
      class:closeButton={searching}
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
    disabled={searching}
    class="divider"
    class:disabled={searching}
    use:resizableHandle
  />
</div>

<style>
  .screens {
    display: flex;
    flex-direction: column;
    min-height: 147px;
    max-height: calc(100% - 147px);
    position: relative;
    transition: height 300ms ease-out, max-height 300ms ease-out;
    height: 210px;
  }
  .screens.searching {
    max-height: 100%;
    height: 100% !important;
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
  .screens.searching input {
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
  .divider.disabled {
    cursor: auto;
  }
  .divider.disabled:after {
    background: var(--spectrum-global-color-gray-200);
  }
</style>
