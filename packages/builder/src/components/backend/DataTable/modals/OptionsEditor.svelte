<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { Icon, Popover } from "@budibase/bbui"
  import { onMount, tick } from "svelte"
  import { Constants } from "@budibase/frontend-core"
  import { getSequentialName } from "helpers/duplicate"

  export let constraints
  export let optionColors = {}

  const flipDurationMs = 150
  const { OptionColours } = Constants

  let options = []
  let colorPopovers = []
  let anchors = []

  $: enrichedOptions = options.map((option, idx) => ({
    ...option,
    color: optionColors?.[option.name] || defaultColor(idx),
  }))

  const defaultColor = idx => OptionColours[idx % OptionColours.length]

  const removeInput = name => {
    delete optionColors[name]
    constraints.inclusion = constraints.inclusion.filter(opt => opt !== name)
    options = options.filter(opt => opt.name !== name)
    colorPopovers.pop(undefined)
    anchors.pop(undefined)
  }

  const addNewInput = async () => {
    const newName = getSequentialName(constraints.inclusion, "Option ", {
      numberFirstItem: true,
    })
    const newId = Math.random()
    options = [...options, { name: newName, id: newId }]
    constraints.inclusion = [...constraints.inclusion, newName]
    optionColors[newName] = defaultColor(options.length - 1)
    colorPopovers.push(undefined)
    anchors.push(undefined)
    await tick()
    document.getElementById(`option-${newId}`)?.focus()
  }

  const handleDndConsider = e => {
    options = e.detail.items
  }
  const handleDndFinalize = e => {
    options = e.detail.items
    constraints.inclusion = options.map(option => option.name)
  }

  const handleColorChange = (name, color, idx) => {
    optionColors[name] = color
    colorPopovers[idx].hide()
  }

  const handleNameChange = (name, idx, newName) => {
    // Check we don't already have this option
    const existing = options.some((option, optionIdx) => {
      return newName === option.name && idx !== optionIdx
    })
    const invalid = !newName || existing
    options.find(option => option.name === name).invalid = invalid
    options = options.slice()

    // Stop if invalid or no change
    if (invalid || name === newName) {
      return
    }

    constraints.inclusion[idx] = newName
    options[idx].name = newName
    optionColors[newName] = optionColors[name]
    delete optionColors[name]
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

  onMount(() => {
    // Initialize anchor arrays on mount, assuming 'options' is already populated
    colorPopovers = constraints.inclusion.map(() => undefined)
    anchors = constraints.inclusion.map(() => undefined)
    options = constraints.inclusion.map(value => ({
      id: Math.random(),
      name: value,
    }))
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="wrapper">
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
    {#each enrichedOptions as option, idx (option.id)}
      <div
        class="option"
        animate:flip={{ duration: flipDurationMs }}
        class:invalid={option.invalid}
      >
        <div class="drag-handle">
          <Icon name="DragHandle" size="L" />
        </div>
        <div
          bind:this={anchors[idx]}
          class="color-picker"
          on:click={e => openColorPickerPopover(idx, e.target)}
        >
          <div class="circle" style="--color:{option.color}">
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
                    class:selected={colorOption === option.color}
                  />
                {/each}
              </div>
            </Popover>
          </div>
        </div>
        <input
          class="option-name"
          type="text"
          value={option.name}
          placeholder="Option name"
          id="option-{option.id}"
          on:input={e => handleNameChange(option.name, idx, e.target.value)}
        />
        <Icon
          name="Close"
          hoverable
          size="S"
          on:click={removeInput(option.name)}
        />
      </div>
    {/each}
  </div>
  <div on:click={addNewInput} class="add-option">
    <Icon name="Add" />
    <div>Add option</div>
  </div>
</div>

<style>
  /* Container */
  .wrapper {
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background-color: var(--spectrum-global-color-gray-50);
  }
  .options > *,
  .add-option {
    height: 32px;
  }

  /* Options row */
  .option {
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
      border-color 130ms ease-in-out;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid transparent;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    gap: var(--spacing-m);
    padding: 0 var(--spacing-m) 0 var(--spacing-s);
    outline: none !important;
  }
  .option.invalid {
    border: 1px solid var(--spectrum-global-color-red-400);
  }
  .option:not(.invalid):hover,
  .option:not(.invalid):focus {
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
