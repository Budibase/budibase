<script>
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"
  import { Label } from "@budibase/bbui"
  const xPath =
    "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"

  export let value = []
  export let label

  let placeholder = "Type to search"
  let options = []
  let optionsVisible = false
  let selected = {}
  let first = true
  let slot

  onMount(() => {
    const domOptions = Array.from(slot.querySelectorAll("option"))
    options = domOptions.map(option => ({
      value: option.value,
      name: option.textContent,
    }))
    if (value) {
      options.forEach(option => {
        if (value.includes(option.value)) {
          selected[option.value] = option
        }
      })
    }
    first = false
  })

  // Keep value up to date with selected options
  $: {
    if (!first) {
      value = Object.values(selected).map(option => option.value)
    }
  }

  function add(token) {
    selected[token.value] = token
  }

  function remove(value) {
    const { [value]: val, ...rest } = selected
    selected = rest
  }

  function removeAll() {
    selected = []
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
    if (selected[value]) {
      remove(value)
    } else {
      add(options.filter(option => option.value === value)[0])
    }
  }
</script>

<div>
  {#if label}
    <Label extraSmall grey>{label}</Label>
  {/if}
  <div class="multiselect">
    <div class="tokens-wrapper">
      <div
        class="tokens"
        class:optionsVisible
        on:click|self={handleClick}
        class:empty={!value || !value.length}>
        {#each Object.values(selected) as option}
          <div class="token" data-id={option.value} on:click|self={handleClick}>
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
        {#if !value || !value.length}&nbsp;{/if}
      </div>
    </div>

    <select bind:this={slot} type="multiple" class="hidden">
      <slot />
    </select>

    {#if optionsVisible}
      <div class="options-overlay" on:click|self={() => showOptions(false)} />
      <ul
        class="options"
        transition:fly={{ duration: 200, y: 5 }}
        on:mousedown|preventDefault={handleOptionMousedown}>
        {#each options as option}
          <li class:selected={selected[option.value]} data-value={option.value}>
            {option.name}
          </li>
        {/each}
        {#if !options.length}
          <li class="no-results">No results</li>
        {/if}
      </ul>
    {/if}
  </div>
</div>

<style>
  .multiselect {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
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
    z-index: 2;
  }

  .tokens {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 0;
    flex: 1 1 auto;
    background-color: var(--grey-2);
    border-radius: var(--border-radius-m);
    padding: 0 var(--spacing-m) calc(var(--spacing-m) - var(--spacing-xs))
      calc(var(--spacing-m) / 2);
    border: var(--border-transparent);
  }
  .tokens:hover {
    cursor: pointer;
  }
  .tokens::after {
    background: none repeat scroll 0 0 transparent;
    bottom: -1px;
    content: "";
    display: block;
    height: 2px;
    left: 50%;
    position: absolute;
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
    width: 0;
  }
  .tokens.optionsVisible {
    border: var(--border-blue);
  }
  .tokens.empty {
    padding: var(--spacing-m);
    font-size: var(--font-size-xs);
    user-select: none;
  }
  .tokens::after {
    width: 100%;
    left: 0;
  }
  .token {
    font-size: var(--font-size-xs);
    align-items: center;
    background-color: white;
    border-radius: var(--border-radius-l);
    display: flex;
    margin: calc(var(--spacing-m) - var(--spacing-xs)) 0 0
      calc(var(--spacing-m) / 2);
    max-height: 1.3rem;
    padding: var(--spacing-xs) var(--spacing-s);
    transition: background-color 0.3s;
    white-space: nowrap;
  }
  .token span {
    pointer-events: none;
    user-select: none;
  }
  .token-remove {
    align-items: center;
    background-color: var(--grey-4);
    border-radius: 50%;
    color: var(--white);
    display: flex;
    justify-content: center;
    height: 1rem;
    width: 1rem;
    margin: calc(-1 * var(--spacing-xs)) 0 calc(-1 * var(--spacing-xs))
      var(--spacing-xs);
  }
  .token-remove:hover {
    background-color: var(--grey-5);
    cursor: pointer;
  }

  .icon-clear path {
    fill: white;
  }

  .options-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
  }

  .options {
    z-index: 2;
    left: 0;
    list-style: none;
    margin-block-end: 0;
    margin-block-start: 0;
    overflow-y: auto;
    padding-inline-start: 0;
    position: absolute;
    top: calc(100% + 1px);
    width: calc(100% - 4px);
    border: var(--border-dark);
    border-radius: var(--border-radius-m);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
    margin-top: var(--spacing-xs);
    padding: var(--spacing-s) 0;
    background-color: white;
    max-height: 200px;
  }
  li {
    background-color: white;
    cursor: pointer;
    padding: var(--spacing-s) var(--spacing-m);
    font-size: var(--font-size-xs);
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
    display: none;
  }
</style>
