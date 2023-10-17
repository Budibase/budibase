<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import Icon from "../Icon/Icon.svelte"
  import Popover from "../Popover/Popover.svelte"
  import { onMount } from "svelte"
  const flipDurationMs = 150

  export let constraints
  export let optionColors = {}
  let options = []

  let colorPopovers = []
  let anchors = []

  let colorsArray = [
    "hsla(0, 90%, 75%, 0.3)",
    "hsla(50, 80%, 75%, 0.3)",
    "hsla(120, 90%, 75%, 0.3)",
    "hsla(200, 90%, 75%, 0.3)",
    "hsla(240, 90%, 75%, 0.3)",
    "hsla(320, 90%, 75%, 0.3)",
  ]
  const removeInput = idx => {
    delete optionColors[options[idx].name]
    constraints.inclusion = constraints.inclusion.filter((e, i) => i !== idx)
    options = options.filter((e, i) => i !== idx)
    colorPopovers.pop(undefined)
    anchors.pop(undefined)
  }

  const addNewInput = () => {
    options = [
      ...options,
      { name: `Option ${constraints.inclusion.length + 1}`, id: Math.random() },
    ]
    constraints.inclusion = [
      ...constraints.inclusion,
      `Option ${constraints.inclusion.length + 1}`,
    ]

    colorPopovers.push(undefined)
    anchors.push(undefined)
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

  const openColorPickerPopover = (optionIdx, target) => {
    colorPopovers[optionIdx].show()
    anchors[optionIdx] = target
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

<div>
  <div
    class="actions"
    use:dndzone={{
      items: options,
      flipDurationMs,
      dropTargetStyle: { outline: "none" },
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each options as option, idx (option.id)}
      <div
        class="no-border action-container"
        animate:flip={{ duration: flipDurationMs }}
      >
        <div class="child drag-handle-spacing">
          <Icon name="DragHandle" size="L" />
        </div>
        <div class="child color-picker">
          <div
            id="color-picker"
            bind:this={anchors[idx]}
            style="--color:{optionColors?.[option.name] ||
              'hsla(0, 1%, 50%, 0.3)'}"
            class="circle"
            on:click={e => openColorPickerPopover(idx, e.target)}
          >
            <Popover
              bind:this={colorPopovers[idx]}
              anchor={anchors[idx]}
              align="left"
              offset={0}
              style=""
              popoverTarget={document.getElementById(`color-picker`)}
              animate={false}
            >
              <div class="colors">
                {#each colorsArray as color}
                  <div
                    on:click={() => handleColorChange(option.name, color, idx)}
                    style="--color:{color};"
                    class="circle circle-hover"
                  />
                {/each}
              </div>
            </Popover>
          </div>
        </div>
        <div class="child">
          <input
            class="input-field"
            type="text"
            on:change={e => handleNameChange(option.name, idx, e.target.value)}
            value={option.name}
            placeholder="Option name"
          />
        </div>
        <div class="child">
          <Icon name="Close" hoverable size="S" on:click={removeInput(idx)} />
        </div>
      </div>
    {/each}
  </div>
  <div on:click={addNewInput} class="add-option">
    <Icon hoverable name="Add" />
    <div>Add option</div>
  </div>
</div>

<style>
  .action-container {
    background-color: var(--spectrum-alias-background-color-primary);
    border-radius: 0px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
      border-color 130ms ease-in-out;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .no-border {
    border-bottom: none;
  }

  .action-container:last-child {
    border-bottom: 1px solid var(--spectrum-global-color-gray-300) !important;
  }

  .child {
    height: 30px;
  }
  .child:hover,
  .child:focus {
    background: var(--spectrum-global-color-gray-200);
  }
  .add-option {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: var(--spacing-m);
    gap: var(--spacing-m);
    cursor: pointer;
  }

  .input-field {
    border: none;
    outline: none;
    background-color: transparent;
    width: 100%;
    color: var(--text);
  }

  .child input[type="text"] {
    padding-left: 10px;
  }

  .input-field:hover,
  .input-field:focus {
    background: var(--spectrum-global-color-gray-200);
  }

  .action-container > :nth-child(1) {
    flex-grow: 1;
    justify-content: center;
    display: flex;
  }

  .action-container > :nth-child(2) {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .action-container > :nth-child(3) {
    flex-grow: 4;
    display: flex;
  }
  .action-container > :nth-child(4) {
    flex-grow: 1;
    justify-content: center;
    display: flex;
  }

  .circle {
    height: 20px;
    width: 20px;
    background-color: var(--color);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
  }

  .circle-hover:hover {
    border: 1px solid var(--spectrum-global-color-blue-400);
    cursor: pointer;
  }

  .colors {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--spacing-xl);
    justify-items: center;
    margin: var(--spacing-m);
  }
</style>
