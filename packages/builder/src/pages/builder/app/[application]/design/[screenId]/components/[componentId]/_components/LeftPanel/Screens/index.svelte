<script>
  import { Icon, Layout, Body } from "@budibase/bbui"
  import { store, sortedScreens, userSelectedResourceMap } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import RoleIndicator from "./RoleIndicator.svelte"
  import DropdownMenu from "./DropdownMenu.svelte"
  import NewScreen from "components/design/NewScreen/index.svelte"
  import { tick } from "svelte"

  let newScreen = false
  let search = false
  let searchValue = ""
  let searchInput
  let screensContainer
  let scrolling = false

  $: filteredScreens = getFilteredScreens($sortedScreens, searchValue)

  const openSearch = async () => {
    search = true
    await tick()
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
</div>

<div class="newScreen" class:newScreenVisible={newScreen}>
  <NewScreen onClose={() => (newScreen = false)} />
</div>

<style>
  .newScreen {
    display: none;
    width: 100vw;
    bottom: 0;
    position: absolute;
    height: calc(100vh - 58px);
    z-index: 2;
    background-color: var(--background);
  }

  .newScreenVisible {
    display: initial;
  }

  .screens {
    height: 212px;
    display: flex;
    flex-direction: column;
    transition: height 300ms ease-out;
  }

  .screenSearch {
    height: 100%;
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
    transition: border-bottom 300ms ease-out;
  }

  .headerScrolling {
    border-bottom: 2px solid var(--grey-2);
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

  .screenSearch input {
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

  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
