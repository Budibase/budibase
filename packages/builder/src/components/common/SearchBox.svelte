<script>
  import { tick } from "svelte"
  import { Icon, Body } from "@budibase/bbui"
  import { screensHeight } from "builderStore"

  export let title
  export let placeholder

  let searchValue
  let searchInput
  let search = false

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const openSearch = async () => {
    search = true
    await tick()
    searchInput.focus()
  }

  const closeSearch = async () => {
    search = false
    searchValue = ""
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
    bind:value={searchValue}
    bind:this={searchInput}
    class="input"
    {placeholder}
  />
  <div class="title" class:hide={search}>
    <Body size="S">{title}</Body>
  </div>
  <div
    on:click={openSearch}
    on:keydown={openSearch}
    class="searchButton"
    class:hide={search}
  >
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
  .search input {
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
  /* 
  :global(.nav-item) {
    padding-right: 8px !important;
  } */

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
