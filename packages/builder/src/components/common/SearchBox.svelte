<script>
  import { tick } from "svelte"
  import { Icon, Body } from "@budibase/bbui"

  export let title
  export let placeholder
  export let value

  let searchInput
  let search = false

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
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="header" class:search>
  <input
    readonly={!search}
    bind:value
    bind:this={searchInput}
    class="searchBox"
    class:hide={!search}
    {placeholder}
  />

  <div on:click={closeSearch} class="closeButton" class:hide={!search}>
    <Icon name="Add" />
  </div>
  <div class="title" class:hide={search}>
    <Body size="S">{title}</Body>
  </div>
  <div on:click={openSearch} class="searchButton" class:hide={search}>
    <Icon size="S" name="Search" />
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

  .closeButton {
    display: flex;
    transform: rotate(45deg);
    color: var(--grey-7);
    cursor: pointer;
    transition: transform 300ms ease-out;
  }

  .closeButton:hover {
    color: var(--ink);
  }
</style>
