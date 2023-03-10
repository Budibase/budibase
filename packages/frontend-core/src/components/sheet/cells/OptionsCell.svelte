<script>
  import { Icon } from "@budibase/bbui"
  import { getColor } from "../utils"

  export let value
  export let schema
  export let onChange
  export let selected = false
  export let multi = false
  export let readonly = false

  let open = false

  $: options = schema?.constraints?.inclusion || []
  $: editable = selected && !readonly
  $: values = Array.isArray(value) ? value : [value].filter(x => x != null)
  $: unselectedOptions = options.filter(x => !values.includes(x))
  $: {
    // Close when deselected
    if (!selected) {
      open = false
    }
  }

  const getOptionColor = value => {
    const index = value ? options.indexOf(value) : null
    return getColor(index)
  }

  const toggleOption = option => {
    if (!multi) {
      onChange(option)
    } else {
      if (values.includes(option)) {
        onChange(values.filter(x => x !== option))
      } else {
        onChange([...values, option])
      }
    }
  }

  const toggleOpen = () => {
    if (multi) {
      open = true
    } else {
      open = !open
    }
  }
</script>

<div
  class="container"
  class:multi
  class:editable
  class:open
  on:click={editable ? toggleOpen : null}
>
  <div class="values">
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
  {#if open}
    <div class="options" on:wheel={e => e.stopPropagation()}>
      {#each values as val}
        {@const color = getOptionColor(val)}
        <div class="option" on:click={() => toggleOption(val)}>
          <div class="badge text" style="--color: {color}">
            {val}
          </div>
          <Icon
            name="Checkmark"
            color="var(--spectrum-global-color-blue-400)"
          />
        </div>
      {/each}
      {#each unselectedOptions as option}
        <div class="option" on:click={() => toggleOption(option)}>
          <div class="badge text" style="--color: {getOptionColor(option)}">
            {option}
          </div>
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
    border-right: 2px solid var(--spectrum-global-color-blue-400);
    position: absolute;
    right: 0;
    top: 2px;
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
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
    justify-content: flex-start;
    align-items: stretch;
    max-height: calc(6 * var(--cell-height) - 1px);
    overflow-y: auto;
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
  .option:hover {
    background-color: var(--spectrum-global-color-gray-200);
  }
</style>
