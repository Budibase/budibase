<script lang="ts">
  import { tick } from "svelte"
  import { Icon, Body } from "@budibase/bbui"
  import { keyUtils } from "@/helpers/keyUtils"

  export let title: string
  export let placeholder: string = ""
  export let value: string | undefined = undefined
  export let onAdd: (_e: Event) => void
  export let search: boolean = false
  export let searchable = true
  export let showAddIcon = true

  let searchInput: HTMLInputElement

  const openSearch = async () => {
    search = true
    await tick()
    searchInput.focus()
  }

  const closeSearch = async () => {
    search = false
    value = ""
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeSearch()
    }
  }

  const handleAddButton = (e: Event) => {
    if (search) {
      closeSearch()
    } else {
      onAdd(e)
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
    {#if $$slots.default}
      <slot></slot>
    {:else}
      <Body size="S">{title}</Body>
    {/if}
  </div>

  {#if searchable}
    <div
      on:click={openSearch}
      on:keydown={keyUtils.handleEnter(openSearch)}
      class="searchButton"
      class:hide={search}
    >
      <Icon
        size="S"
        name="magnifying-glass"
        hoverable
        hoverColor="var(--ink)"
      />
    </div>
  {/if}

  {#if showAddIcon}
    <div
      on:click={handleAddButton}
      on:keydown={e => keyUtils.handleEnter(() => handleAddButton(e))}
      class="addButton"
      class:rotate={search}
    >
      <Icon name="plus" hoverable hoverColor="var(--ink)" />
    </div>
  {/if}

  <slot name="right" />
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
