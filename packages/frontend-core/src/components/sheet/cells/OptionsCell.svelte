<script>
  import { Icon } from "@budibase/bbui"
  import { getColor } from "../lib/utils"
  import { onMount } from "svelte"

  export let value
  export let schema
  export let onChange
  export let selected = false
  export let multi = false
  export let readonly = false
  export let api
  export let invert = false

  let isOpen = false
  let focusedOptionIdx = null

  $: options = schema?.constraints?.inclusion || []
  $: editable = selected && !readonly
  $: values = Array.isArray(value) ? value : [value].filter(x => x != null)
  $: {
    // Close when deselected
    if (!selected) {
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
      if (values.includes(option)) {
        onChange(values.filter(x => x !== option))
      } else {
        onChange([...values, option])
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
      onKeyDown,
    }
  })
</script>

<div class="container" class:multi class:editable class:open>
  <div class="values" on:click={editable ? open : null}>
    {#each values as val}
      {@const color = getOptionColor(val)}
      {#if color}
        <div class="badge text" style="--color: {color}">
          {val}
        </div>
      {:else}
        <div class="text">
          {val || ""}
        </div>
      {/if}
    {/each}
  </div>
  {#if editable}
    <div class="arrow">
      <Icon name="ChevronDown" />
    </div>
  {/if}
  {#if isOpen}
    <div class="options" class:invert on:wheel={e => e.stopPropagation()}>
      {#each options as option, idx}
        {@const color = getOptionColor(option)}
        <div
          class="option"
          on:click={() => toggleOption(option)}
          class:focused={focusedOptionIdx === idx}
        >
          <div class="badge text" style="--color: {color}">
            {option}
          </div>
          {#if values.includes(option)}
            <Icon
              name="Checkmark"
              color="var(--spectrum-global-color-blue-400)"
            />
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
    align-items: stretch;
    align-self: stretch;
    flex: 1 1 auto;
  }
  .container.editable:hover {
    cursor: pointer;
  }
  .values {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex: 1 1 auto;
    width: 0;
    gap: var(--cell-spacing);
    overflow: hidden;
    padding: 0 var(--cell-padding);
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
    padding: 2px var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
  }
  .arrow {
    /*border-right: 2px solid var(--spectrum-global-color-blue-400);*/
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
    min-width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
    justify-content: flex-start;
    align-items: stretch;
    max-height: var(--max-cell-render-height);
    overflow-y: auto;
    border: var(--cell-border);
  }
  .options.invert {
    transform: translateY(-100%);
    top: 0;
  }
  .option {
    flex: 0 0 var(--cell-height);
    padding: 0 var(--cell-padding);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--cell-spacing);
    background-color: var(--cell-background-hover);
  }
  .option:first-child {
    flex: 0 0 calc(var(--cell-height) - 1px);
  }
  .option:hover,
  .option.focused {
    background-color: var(--spectrum-global-color-gray-200);
  }
</style>
