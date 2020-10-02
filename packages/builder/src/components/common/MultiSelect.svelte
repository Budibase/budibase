<script>
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"
  import { Label } from "@budibase/bbui"
  const xPath =
    "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"

  export let value = []
  export let readonly = false
  export let label

  let placeholder = "Type to search"
  let input
  let inputValue
  let options = []
  let activeOption
  let optionsVisible = false
  let selected = {}
  let first = true
  let slot

  onMount(() => {
    slot.querySelectorAll("option").forEach(o => {
      o.selected && !value.includes(o.value) && (value = [...value, o.value])
      options = [...options, { value: o.value, name: o.textContent }]
    })
    value &&
      (selected = options.reduce(
        (obj, op) =>
          value.includes(op.value) ? { ...obj, [op.value]: op } : obj,
        {}
      ))
    first = false
  })

  $: if (!first) value = Object.values(selected).map(o => o.value)
  $: filtered = options.filter(o =>
    inputValue ? o.name.toLowerCase().includes(inputValue.toLowerCase()) : o
  )
  $: if (
    (activeOption && !filtered.includes(activeOption)) ||
    (!activeOption && inputValue)
  )
    activeOption = filtered[0]

  function add(token) {
    if (!readonly) selected[token.value] = token
  }

  function remove(value) {
    if (!readonly) {
      const { [value]: val, ...rest } = selected
      selected = rest
    }
  }

  function removeAll() {
    selected = []
    inputValue = ""
  }

  function showOptions(show) {
    optionsVisible = show
    if (!show) {
      activeOption = undefined
    } else {
      input.focus()
    }
  }

  function handleBlur() {
    showOptions(false)
  }

  function handleFocus() {
    showOptions(true)
  }

  function handleOptionMousedown(e) {
    const value = e.target.dataset.value
    if (selected[value]) {
      remove(value)
    } else {
      add(options.filter(option => option.value === value)[0])
      input.focus()
    }
  }
</script>

<div>
  {#if label}
    <Label extraSmall grey>{label}</Label>
  {/if}
  <div class="multiselect" class:readonly>
    <div class="tokens-wrapper">
      <div class="tokens" class:showOptions>
        {#each Object.values(selected) as option}
          <div class="token" data-id={option.value}>
            <span>{option.name}</span>
            {#if !readonly}
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
            {/if}
          </div>
        {/each}
      </div>
    </div>
    <div class="actions">
      {#if !readonly}
        <input
          autocomplete="off"
          bind:value={inputValue}
          bind:this={input}
          on:blur={handleBlur}
          on:focus={handleFocus}
          {placeholder} />
        <div
          class="remove-all"
          title="Remove All"
          class:hidden={!Object.keys(selected).length}
          on:click={removeAll}>
          <svg
            class="icon-clear"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24">
            <path d={xPath} />
          </svg>
        </div>
      {/if}
    </div>

    <select bind:this={slot} type="multiple" class="hidden">
      <slot />
    </select>

    {#if optionsVisible}
      <ul
        class="options"
        transition:fly={{ duration: 200, y: 5 }}
        on:mousedown|preventDefault={handleOptionMousedown}>
        {#each filtered as option}
          <li
            class:selected={selected[option.value]}
            class:active={activeOption === option}
            data-value={option.value}>
            {option.name}
          </li>
        {/each}
        {#if !filtered.length && inputValue.length}
          <li>No results</li>
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
  .multiselect:not(.readonly):hover {
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
  .tokens.showOptions::after {
    width: 100%;
    left: 0;
  }
  .token {
    font-size: var(--font-size-xs);
    align-items: center;
    background-color: var(--grey-3);
    border-radius: var(--border-radius-l);
    display: flex;
    margin: 0.25rem 0.5rem 0.25rem 0;
    max-height: 1.3rem;
    padding: var(--spacing-s) var(--spacing-m);
    transition: background-color 0.3s;
    white-space: nowrap;
  }
  .token:hover {
    background-color: var(--grey-4);
  }
  .readonly .token {
    color: hsl(0, 0%, 40%);
  }
  .token-remove,
  .remove-all {
    align-items: center;
    background-color: var(--grey-5);
    border-radius: 50%;
    color: var(--white);
    display: flex;
    justify-content: center;
    height: 1.25rem;
    margin-left: 0.25rem;
    min-width: 1.25rem;
  }
  .token-remove:hover,
  .remove-all:hover {
    background-color: var(--grey-6);
    cursor: pointer;
  }

  .actions {
    align-items: center;
    display: flex;
    flex: 1;
  }
  .actions > * {
    flex: 0 0 auto;
  }
  .actions > input {
    border: none;
    font-size: var(--font-size-xs);
    line-height: 1.5rem;
    outline: none;
    background-color: transparent;
    flex: 1 1 auto;
  }

  .icon-clear path {
    fill: white;
  }

  .options {
    left: 0;
    list-style: none;
    margin-block-end: 0;
    margin-block-start: 0;
    max-height: 70vh;
    overflow: auto;
    padding-inline-start: 0;
    position: absolute;
    top: calc(100% + 1px);
    width: calc(100% - 4px);
    border: var(--border-dark);
    border-radius: var(--border-radius-m);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
    margin-top: var(--spacing-xs);
    padding: var(--spacing-s) 0;
    z-index: 1;
    background-color: white;
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

  .hidden {
    display: none;
  }
</style>
