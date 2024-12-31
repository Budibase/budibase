<script>
  import { tick } from "svelte"
  import { Icon, Body } from "@budibase/bbui"
  import { keyUtils } from "@/helpers/keyUtils"

  export let title
  export let placeholder
  export let value
  export let onAdd
  export let search

  let searchInput

  const openSearch = async () => {
    search = true
    await tick()
    searchInput.focus()
  }

  const closeSearch = async () => {
    search = false
    value = ""
  }

  const onKeyDown = e => {
    if (e.key === "Escape") {
      closeSearch()
    }
  }

  const handleAddButton = () => {
    if (search) {
      closeSearch()
    } else {
      onAdd()
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="header" class:search>
  <input
    readonly={!search}
    bind:value
    bind:this={searchInput}
    class="searchBox"
    class:hide={!search}
    {placeholder}
  />

  <div class="title" class:hide={search}>
    <Body size="S">{title}</Body>
  </div>
  <div
    on:click={openSearch}
    on:keydown={keyUtils.handleEnter(openSearch)}
    class="searchButton"
    class:hide={search}
  >
    <Icon size="S" name="Search" hoverable hoverColor="var(--ink)" />
  </div>

  <div
    on:click={handleAddButton}
    on:keydown={keyUtils.handleEnter(handleAddButton)}
    class="addButton"
    class:rotate={search}
  >
    <Icon name="Add" hoverable hoverColor="var(--ink)" />
  </div>
</div>

<style>
  .search {
    transition: height 300ms ease-out;
    max-height: none;
  }

  .header {
    flex-shrink: 0;
    flex-direction: row;
    position: relative;
    height: 50px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid transparent;
    transition: border-bottom 130ms ease-out;
    gap: var(--spacing-l);
  }

  .searchBox {
    font-family: var(--font-sans);
    color: var(--ink);
    background-color: transparent;
    border: none;
    font-size: var(--spectrum-alias-font-size-default);
    display: flex;
  }
  .searchBox:focus {
    outline: none;
  }
  .searchBox::placeholder {
    color: var(--spectrum-global-color-gray-600);
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

  .searchButton {
    color: var(--grey-7);
    cursor: pointer;
    opacity: 1;
  }
  .searchButton:hover {
    color: var(--ink);
  }

  .hide {
    opacity: 0;
    pointer-events: none;
    display: none !important;
  }

  .addButton {
    display: flex;
    transition: transform 300ms ease-out;
    color: var(--grey-7);
    cursor: pointer;
  }

  .addButton:hover {
    color: var(--ink);
  }

  .rotate {
    transform: rotate(45deg);
  }
</style>
