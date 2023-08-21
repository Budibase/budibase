<script>
  import { Icon, Layout, Body } from "@budibase/bbui"
  import { store, sortedScreens, userSelectedResourceMap } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import RoleIndicator from "./RoleIndicator.svelte"
  import DropdownMenu from "./DropdownMenu.svelte"
  import NewScreen from "components/design/NewScreen/index.svelte"

  let newScreen = false
  let search = false
  let searchValue = ""
  let searchInput
  let screensContainer
  let scrolling = false

  $: filteredScreens = getFilteredScreens($sortedScreens, searchValue)

  const openSearch = () => {
    search = true
    searchInput.focus()
    screensContainer.scroll({ top: 0, behavior: "smooth" })
  }

  const closeSearch = () => {
    search = false
    searchValue = ""
  }

  const getFilteredScreens = (screens, search) => {
    return screens.filter(screen => {
      const searchMatch = !search || screen.routing.route.includes(search)
      return searchMatch
    })
  }

  const handleAddButton = () => {
    if (search) {
      closeSearch()
    } else {
      newScreen = true
    }
  }

  const onKeyDown = e => {
    if (e.key === "Escape") {
      if (newScreen) {
        newScreen = false
      } else {
        closeSearch()
      }
    }
  }

  const handleScroll = e => {
    if (e.target.scrollTop === 0) {
      scrolling = false
    } else {
      scrolling = true
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="screens" class:screenSearch={search}>
  <div class="header" class:headerScrolling={scrolling}>
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
  </div>
  {#if !filteredScreens?.length}
    <Layout paddingY="" paddingX="L">
      <Body size="S">
        There aren't any screens matching the current filters
      </Body>
    </Layout>
  {/if}
</div>

<div class="newScreen" class:newScreenVisible={newScreen}>
  <NewScreen onClose={() => (newScreen = false)} />
</div>

<style>
  .newScreen {
    width: 100vw;
    height: 0;
    bottom: 0;
    overflow: hidden;
    position: absolute;
    background-color: var(--background);
    z-index: 2;
    transition: height 350ms ease-in-out;
  }

  .newScreenVisible {
    height: calc(100vh - 58px);
  }

  .screens {
    height: 212px;
    display: flex;
    flex-direction: column;
    transition: height 300ms;
  }

  .screenSearch {
    height: 100%;
  }

  .header {
    flex-shrink: 0;
    position: relative;
    height: 51px;
    box-sizing: border-box;
    padding: 0 12px 0 0;
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 300ms;
  }

  .headerScrolling {
    border-bottom: 2px solid var(--grey-2);
  }

  .input {
    font-family: var(--font-sans);
    position: absolute;
    padding-left: 12px;
    color: var(--ink);
    background-color: var(--background-alt);
    border: none;
    font-size: var(--spectrum-alias-font-size-default);
    width: 260px;
    box-sizing: border-box;
  }

  .input:focus {
    outline: none;
  }

  .title {
    display: flex;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    padding-left: 12px;
    flex: 1;
    opacity: 1;
    transition: opacity 300ms;
    background-color: var(--background-alt);
    z-index: 1;
  }

  .content {
    overflow: auto;
    flex-grow: 1;
  }

  .content::-webkit-scrollbar-track {
    background: var(--background-alt);
  }

  .content::-webkit-scrollbar {
    width: 18px;
  }

  .content::-webkit-scrollbar-thumb {
    background-color: var(--grey-3);
    border-radius: 20px;
    border: 1px solid var(--background-alt);
    border-width: 5px 5px;
  }

  .screens :global(.nav-item) {
    padding-right: 8px !important;
  }

  .searchButton {
    color: var(--grey-7);
    cursor: pointer;
    margin-right: 10px;
    opacity: 1;
    transition: opacity 300ms;
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
    transition: transform 300ms;
  }

  .closeButton {
    transform: rotate(45deg);
  }

  .addButton:hover {
    color: var(--ink);
  }

  .icon {
    margin-left: 4px;
    margin-right: 4px;
  }
</style>
