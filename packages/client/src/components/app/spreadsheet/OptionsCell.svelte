<script>
  import { Icon } from "@budibase/bbui"

  export let value
  export let schema
  export let selected = false
  export let onChange

  const options = schema?.constraints?.inclusion || []
  const colors = [
    "rgb(207, 223, 255)",
    "rgb(208, 240, 253)",
    "rgb(194, 245, 233)",
    "rgb(209, 247, 196)",
    "rgb(255, 234, 182)",
    "rgb(254, 226, 213)",
    "rgb(255, 220, 229)",
    "rgb(255, 218, 246)",
    "rgb(237, 226, 254)",
  ]

  let open = false

  $: color = getColor(value)
  $: {
    // Close when deselected
    if (!selected) {
      open = false
    }
  }

  const getColor = value => {
    const index = options.indexOf(value)
    if (!value || index === -1) {
      return null
    }
    return colors[index % colors.length]
  }

  const toggle = () => {
    open = !open
  }
</script>

<div
  class="container"
  class:selected
  class:open
  on:click={selected ? toggle : null}
>
  {#if color}
    <div class="badge text" style="--color: {color}">
      {value}
    </div>
  {:else if value}
    <div class="text">
      {value}
    </div>
  {/if}
  {#if selected}
    <Icon name="ChevronDown" />
  {/if}
  {#if open}
    <div class="options">
      <div class="option">
        <div class="badge text" style="--color: {color}">
          {value}
        </div>
        <Icon name="Checkmark" color="var(--spectrum-global-color-blue-400)" />
      </div>
      {#each options.filter(x => x !== value) as option}
        <div class="option" on:click={() => onChange(option)}>
          <div class="badge text" style="--color: {getColor(option)}">
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
    align-items: center;
    padding: 0 8px;
    flex: 1 1 auto;
    overflow: hidden;
    gap: 4px;
  }
  .container.selected:hover {
    cursor: pointer;
  }
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .badge {
    padding: 2px 8px;
    background: var(--color);
    border-radius: 8px;
    color: #2c2c2c;
    user-select: none;
  }
  .options {
    min-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
    max-height: 191px;
    overflow-y: auto;
  }
  .option {
    flex: 0 0 32px;
    padding: 0 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: var(--spectrum-global-color-gray-50);
  }
  .option:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
</style>
