<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { Icon, Popover } from "@budibase/bbui"
  import { onMount, tick } from "svelte"
  import { Constants } from "@budibase/frontend-core"

  export let constraints
  export let optionColors = {}

  const flipDurationMs = 150
  const { OptionColours } = Constants

  let options = []
  let colorPopovers = []
  let anchors = []

  const removeInput = idx => {
    delete optionColors[options[idx].name]
    constraints.inclusion = constraints.inclusion.filter((e, i) => i !== idx)
    options = options.filter((e, i) => i !== idx)
    colorPopovers.pop(undefined)
    anchors.pop(undefined)
  }

  const addNewInput = async () => {
    const newName = `Option ${constraints.inclusion.length + 1}`
    const id = Math.random()
    options = [...options, { name: newName, id }]
    constraints.inclusion = [...constraints.inclusion, newName]
    optionColors[newName] =
      OptionColours[(options.length - 1) % OptionColours.length]
    colorPopovers.push(undefined)
    anchors.push(undefined)
    await tick()
    document.getElementById(`option-${id}`)?.focus()
  }

  const handleDndConsider = e => {
    options = e.detail.items
  }
  const handleDndFinalize = e => {
    options = e.detail.items
    constraints.inclusion = options.map(option => option.name)
  }

  const handleColorChange = (optionName, color, idx) => {
    optionColors[optionName] = color
    colorPopovers[idx].hide()
  }

  const handleNameChange = (optionName, idx, value) => {
    constraints.inclusion[idx] = value
    options[idx].name = value
    optionColors[value] = optionColors[optionName]
    delete optionColors[optionName]
  }

  const openColorPickerPopover = optionIdx => {
    for (let i = 0; i < colorPopovers.length; i++) {
      if (i === optionIdx) {
        colorPopovers[i].show()
      } else {
        colorPopovers[i]?.hide()
      }
    }
  }

  const getOptionColor = (name, idx) => {
    return optionColors?.[name] || OptionColours[idx % OptionColours.length]
  }

  onMount(() => {
    // Initialize anchor arrays on mount, assuming 'options' is already populated
    colorPopovers = constraints.inclusion.map(() => undefined)
    anchors = constraints.inclusion.map(() => undefined)

    options = constraints.inclusion.map(value => ({
      name: value,
      id: Math.random(),
    }))
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="options"
  use:dndzone={{
    items: options,
    flipDurationMs,
    dropTargetStyle: { outline: "none" },
  }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each options as option, idx (`${option.id}-${idx}`)}
    {@const color = getOptionColor(option.name, idx)}
    <div class="option" animate:flip={{ duration: flipDurationMs }}>
      <div class="drag-handle">
        <Icon name="DragHandle" size="L" />
      </div>
      <div
        bind:this={anchors[idx]}
        class="color-picker"
        on:click={e => openColorPickerPopover(idx, e.target)}
      >
        <div class="circle" style="--color:{color}">
          <Popover
            bind:this={colorPopovers[idx]}
            anchor={anchors[idx]}
            align="left"
            offset={0}
            animate={false}
            resizable={false}
          >
            <div class="colors" data-ignore-click-outside="true">
              {#each OptionColours as colorOption}
                <div
                  on:click={() =>
                    handleColorChange(option.name, colorOption, idx)}
                  style="--color:{colorOption};"
                  class="circle"
                  class:selected={colorOption === color}
                />
              {/each}
            </div>
          </Popover>
        </div>
      </div>
      <input
        class="option-name"
        type="text"
        on:change={e => handleNameChange(option.name, idx, e.target.value)}
        value={option.name}
        placeholder="Option name"
        id="option-{option.id}"
      />
      <Icon name="Close" hoverable size="S" on:click={removeInput(idx)} />
    </div>
  {/each}
  <div on:click={addNewInput} class="add-option">
    <Icon name="Add" />
    <div>Add option</div>
  </div>
</div>

<style>
  /* Container */
  .options {
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background-color: var(--spectrum-global-color-gray-50);
  }
  .options > * {
    height: 32px;
  }

  /* Options row */
  .option {
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
      border-color 130ms ease-in-out;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    gap: var(--spacing-m);
    padding: 0 var(--spacing-m) 0 var(--spacing-s);
  }
  .option:hover,
  .option:focus {
    background: var(--spectrum-global-color-gray-100);
  }

  /* Option row components */
  .color-picker {
    align-self: stretch;
    display: grid;
    place-items: center;
  }
  .circle {
    height: 20px;
    width: 20px;
    background-color: var(--color);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid transparent;
    transition: border 130ms ease-out;
  }
  .circle:hover,
  .circle.selected {
    border: 1px solid var(--spectrum-global-color-blue-600);
    cursor: pointer;
  }
  .colors {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--spacing-xl);
    justify-items: center;
    margin: var(--spacing-m);
  }
  .option-name {
    border: none;
    outline: none;
    background-color: transparent;
    width: 100%;
    color: var(--text);
  }

  /* Add option */
  .add-option {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-m);
    gap: var(--spacing-m);
  }
  .add-option:hover {
    cursor: pointer !important;
    background: var(--spectrum-global-color-gray-200);
  }
</style>
