<script>
  import { Icon, clickOutside } from "@budibase/bbui"
  import { getColor } from "../lib/utils"
  import { onMount } from "svelte"

  export let value
  export let schema
  export let onChange
  export let focused = false
  export let multi = false
  export let readonly = false
  export let api
  export let invertX = false
  export let invertY = false
  export let contentLines = 1

  let isOpen = false
  let focusedOptionIdx = null

  $: options = schema?.constraints?.inclusion || []
  $: optionColors = schema?.optionColors || {}
  $: editable = focused && !readonly
  $: values = Array.isArray(value) ? value : [value].filter(x => x != null)
  $: {
    // Close when deselected
    if (!focused) {
      close()
    }
  }

  const open = () => {
    isOpen = true
    focusedOptionIdx = 0
  }

  const close = () => {
    isOpen = false
  }

  const getOptionColor = value => {
    const index = value ? options.indexOf(value) : null
    return getColor(index)
  }

  const toggleOption = option => {
    if (!multi) {
      onChange(option === value ? null : option)
      close()
    } else {
      const sanitizedValues = values.filter(x => options.includes(x))
      if (sanitizedValues.includes(option)) {
        onChange(sanitizedValues.filter(x => x !== option))
      } else {
        onChange([...sanitizedValues, option])
      }
    }
  }

  const onKeyDown = e => {
    if (!isOpen) {
      return false
    }
    e.preventDefault()
    if (e.key === "ArrowDown") {
      focusedOptionIdx = Math.min(focusedOptionIdx + 1, options.length - 1)
    } else if (e.key === "ArrowUp") {
      focusedOptionIdx = Math.max(focusedOptionIdx - 1, 0)
    } else if (e.key === "Enter") {
      toggleOption(options[focusedOptionIdx])
    }
    return true
  }

  onMount(() => {
    api = {
      focus: open,
      blur: close,
      isActive: () => isOpen,
      onKeyDown,
    }
  })
</script>

<div
  class="container"
  class:multi
  class:editable
  class:open
  on:click|self={editable ? open : null}
>
  <div
    class="values"
    class:wrap={contentLines > 1}
    on:click={editable ? open : null}
  >
    {#each values as val}
      {@const color = optionColors[val] || getOptionColor(val)}
      {#if color}
        <div class="badge text" style="--color: {color}">
          <span>
            {val}
          </span>
        </div>
      {:else}
        <div class="text">
          {val || ""}
        </div>
      {/if}
    {/each}
  </div>
  {#if editable}
    <div class="arrow" on:click={open}>
      <Icon name="ChevronDown" />
    </div>
  {/if}
  {#if isOpen}
    <div
      class="options"
      class:invertX
      class:invertY
      on:wheel={e => e.stopPropagation()}
      use:clickOutside={close}
    >
      {#each options as option, idx}
        {@const color = optionColors[option] || getOptionColor(option)}
        <div
          class="option"
          on:click={() => toggleOption(option)}
          class:focused={focusedOptionIdx === idx}
          on:mouseenter={() => (focusedOptionIdx = idx)}
        >
          <div class="badge text" style="--color: {color}">
            {option}
          </div>
          {#if values.includes(option)}
            <Icon name="Checkmark" color="var(--accent-color)" />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
    flex: 1 1 auto;
    overflow: hidden;
  }
  .container.editable:hover {
    cursor: pointer;
  }
  .values {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 1 1 auto;
    grid-column-gap: var(--cell-spacing);
    grid-row-gap: var(--cell-padding);
    overflow: hidden;
    padding: var(--cell-padding);
    flex-wrap: nowrap;
  }
  .values.wrap {
    flex-wrap: wrap;
  }
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .multi .text {
    flex: 0 0 auto;
  }
  .badge {
    padding: 0 var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
    display: flex;
    align-items: center;
    gap: var(--cell-spacing);
    height: 20px;
    max-width: 100%;
  }
  .badge span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .arrow {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    bottom: 2px;
    padding: 0 6px 0 16px;
    display: grid;
    place-items: center;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--cell-background) 40%
    );
  }
  .options {
    min-width: calc(100% + 2px);
    position: absolute;
    top: 100%;
    left: -1px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    max-height: var(--max-cell-render-height);
    overflow-y: auto;
    border: var(--cell-border);
    box-shadow: 0 0 20px -4px rgba(0, 0, 0, 0.15);
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .options.invertX {
    left: auto;
    right: 0;
  }
  .options.invertY {
    transform: translateY(-100%);
    top: 0;
  }
  .option {
    flex: 0 0 var(--default-row-height);
    padding: 0 var(--cell-padding);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--cell-spacing);
    background-color: var(--grid-background-alt);
  }
  .option:hover,
  .option.focused {
    background-color: var(--spectrum-global-color-gray-200);
  }
</style>
