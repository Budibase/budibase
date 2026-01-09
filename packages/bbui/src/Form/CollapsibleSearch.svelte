<script lang="ts">
  import { createEventDispatcher, tick } from "svelte"
  import Icon from "../Icon/Icon.svelte"
  import Search from "./Search.svelte"

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let disabled = false
  export let quiet = false
  export let updateOnChange = true
  export let width: string = "220px"
  export let open = false
  export let collapseOnBlur = true
  export let inputRef: HTMLInputElement | undefined = undefined

  const dispatch = createEventDispatcher()

  const handleChange = (event: CustomEvent<string>) => {
    value = event.detail
    dispatch("change", event.detail)
  }

  const handleClear = () => {
    open = false
    dispatch("clear")
  }

  const openSearch = async () => {
    if (disabled) {
      return
    }
    open = true
    await tick()
    inputRef?.focus()
  }

  const handleBlur = (event: FocusEvent) => {
    if (collapseOnBlur) {
      const inputValue = (event.target as HTMLInputElement | null)?.value || ""
      if (!inputValue.trim()) {
        open = false
      }
    }
    dispatch("blur", event)
  }

  const forwardEvent = (event: Event) => {
    dispatch(event.type, event)
  }
</script>

<div class="collapsible-search" style={`--collapsible-search-width: ${width}`}>
  {#if !open}
    <button
      class="search-toggle"
      type="button"
      on:click={openSearch}
      aria-label="Open search"
    >
      <Icon name="magnifying-glass" size="S" />
    </button>
  {/if}
  <div class="collapsible-search-input" class:open>
    <Search
      {updateOnChange}
      {disabled}
      {placeholder}
      {quiet}
      {value}
      bind:inputRef
      on:change={handleChange}
      on:clear={handleClear}
      on:blur={handleBlur}
      on:focus={forwardEvent}
      on:input={forwardEvent}
      on:click={forwardEvent}
    />
  </div>
</div>

<style>
  .collapsible-search {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .collapsible-search-input {
    width: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    visibility: hidden;
    transition:
      width 200ms ease,
      opacity 200ms ease;
  }

  .collapsible-search-input.open {
    width: var(--collapsible-search-width);
    opacity: 1;
    overflow: visible;
    pointer-events: auto;
    visibility: visible;
  }

  .search-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background-color: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-800);
    cursor: pointer;
  }

  .search-toggle:hover {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .search-toggle:focus {
    outline: 2px solid var(--spectrum-global-color-blue-400);
    outline-offset: 2px;
  }
</style>
