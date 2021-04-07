<script>
  import Portal from "svelte-portal"
  import { afterUpdate } from "svelte"
  import { createEventDispatcher } from "svelte"
  import { fly } from "svelte/transition"
  import Label from "../Styleguide/Label.svelte"
  const xPath =
    "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"

  import positionDropdown from "../Actions/position_dropdown"
  import clickOutside from "../Actions/click_outside"

  const dispatch = createEventDispatcher()

  export let value = []
  export let label = undefined
  export let align = "left"
  export let secondary = false
  export let outline = false
  export let disabled = false
  export let placeholder = undefined
  export let extraThin = false

  let options = []
  let optionsVisible = false
  let slot
  let anchor
  $: lookupMap = mapValues(value)
  $: selectedOptions = options.filter(option => lookupMap[option.value])

  afterUpdate(() => {
    // Update available options
    const domOptions = Array.from(slot.querySelectorAll("option"))
    options = domOptions.map(option => ({
      value: option.value,
      name: option.textContent,
    }))
  })

  function mapValues(value) {
    let map = {}
    if (value) {
      value.forEach(option => {
        map[option] = true
      })
    }
    return map
  }

  function add(val) {
    value = [...value, val]
    dispatch("change", value)
  }

  function remove(val) {
    value = value.filter(option => option !== val)
    dispatch("change", value)
  }

  function showOptions(show) {
    optionsVisible = show
  }

  function handleClick() {
    showOptions(!optionsVisible)
  }

  function handleOptionMousedown(e) {
    const value = e.target.dataset.value
    if (value == null) {
      return
    }
    if (lookupMap[value]) {
      remove(value)
    } else {
      add(value)
    }
  }
</script>

{#if label}
  <Label extraSmall grey>{label}</Label>
{/if}
<div class="multiselect" bind:this={anchor}>
  <div class="tokens-wrapper">
    <div
      class="tokens"
      class:outline
      class:disabled
      class:secondary
      class:extraThin
      class:optionsVisible
      on:click|self={handleClick}
      class:empty={!value || !value.length}>
      {#each selectedOptions as option}
        <div
          class="token"
          class:extraThin
          data-id={option.value}
          on:click|self={handleClick}>
          <span>{option.name}</span>
          <div
            class="token-remove"
            title="Remove {option.name}"
            on:click={() => remove(option.value)}>
            <svg
              class="icon-clear"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24">
              <path d={xPath} />
            </svg>
          </div>
        </div>
      {/each}
      {#if !value || !value.length}
        {#if placeholder && placeholder.length}
          <div class:disabled class="placeholder">{placeholder}</div>
        {:else}
          <div class="placeholder">&nbsp;</div>
        {/if}
      {/if}
    </div>
  </div>

  <select bind:this={slot} type="multiple" class="hidden">
    <slot />
  </select>

  {#if optionsVisible}
    <Portal>
      <ul
        class="options"
        use:positionDropdown={{ anchor, align }}
        use:clickOutside={() => showOptions(false)}
        transition:fly={{ duration: 200, y: 5 }}
        on:mousedown|preventDefault={handleOptionMousedown}>
        {#each options as option}
          <li
            class:selected={lookupMap[option.value]}
            data-value={option.value}>
            {option.name}
          </li>
        {/each}
        {#if !options.length}
          <li class="no-results">No results</li>
        {/if}
      </ul>
    </Portal>
  {/if}
</div>

<style>
  .multiselect {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    font-family: var(--font-sans);
    min-width: 0;
  }
  .multiselect:hover {
    border-bottom-color: hsl(0, 0%, 50%);
  }

  .tokens-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex: 0 1 auto;
  }

  .tokens {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 0;
    flex: 1 1 auto;
    background-color: var(--background);
    border-radius: var(--border-radius-m);
    padding: 0 var(--spacing-m) calc(var(--spacing-m) - var(--spacing-xs))
      calc(var(--spacing-m) / 2);
    border: var(--border-transparent);
  }
  .tokens.disabled {
    background-color: var(--grey-4);
    pointer-events: none;
  }
  .tokens.outline {
    border: var(--border-dark);
  }
  .tokens.secondary {
    background-color: var(--grey-2);
  }
  .tokens.extraThin {
    padding: 0 var(--spacing-m) calc(var(--spacing-s) - var(--spacing-xs))
      calc(var(--spacing-m) / 2);
  }
  .tokens:hover {
    cursor: pointer;
  }
  .tokens.optionsVisible {
    border: var(--border-blue);
  }
  .tokens.empty {
    padding: var(--spacing-m);
    font-size: var(--font-size-xs);
    user-select: none;
  }
  .tokens.empty.extraThin {
    padding: var(--spacing-s) var(--spacing-m);
  }
  .tokens::after {
    width: 100%;
    left: 0;
  }

  .token {
    font-size: var(--font-size-xs);
    background-color: var(--ink);
    color: var(--background);
    border-radius: var(--border-radius-l);
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: calc(var(--spacing-m) - var(--spacing-xs)) 0 0
      calc(var(--spacing-m) / 2);
    max-height: 1.3rem;
    padding: var(--spacing-xs) var(--spacing-s);
    transition: background-color 0.3s;
    white-space: nowrap;
    overflow: hidden;
  }
  .token.extraThin {
    margin: calc(var(--spacing-s) - var(--spacing-xs)) 0 0
      calc(var(--spacing-m) / 2);
  }
  .token span {
    pointer-events: none;
    user-select: none;
    flex: 1 1 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .token .token-remove {
    align-items: center;
    background-color: var(--grey-7);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    height: 1rem;
    width: 1rem;
    margin: calc(-1 * var(--spacing-xs)) 0 calc(-1 * var(--spacing-xs))
      var(--spacing-xs);
    flex: 0 0 auto;
  }
  .token path {
    fill: var(--background);
  }
  .token .token-remove:hover {
    background-color: var(--grey-6);
    cursor: pointer;
  }

  .placeholder {
    pointer-events: none;
    color: var(--ink);
  }
  .placeholder.disabled {
    color: var(--grey-6);
  }

  .icon-clear path {
    fill: white;
  }
  .options {
    left: 0;
    list-style: none;
    margin-block-end: 0;
    margin-block-start: 0;
    overflow-y: auto;
    padding-inline-start: 0;
    position: absolute;
    border: var(--border-dark);
    border-radius: var(--border-radius-m);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
    margin: var(--spacing-xs) 0;
    padding: var(--spacing-s) 0;
    background-color: var(--background);
    max-height: 200px;
  }
  li {
    cursor: pointer;
    padding: var(--spacing-s) var(--spacing-m);
    font-size: var(--font-size-xs);
    color: var(--ink);
  }
  li.selected {
    background-color: var(--blue);
    color: white;
  }
  li:not(.selected):hover {
    background-color: var(--grey-1);
  }
  li.no-results:hover {
    background-color: white;
    cursor: initial;
  }

  .hidden {
    height: 0;
    overflow: hidden;
    visibility: hidden;
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
  }
</style>
