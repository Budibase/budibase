<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import Icon from "../Icon/Icon.svelte"
  import ColorPicker from "../ColorPicker/ColorPicker.svelte"

  const flipDurationMs = 150

  export let values

  let options = []
  $: {
    if (options.length) {
      options = values.map((value, idx) => ({
        name: value,
        id: Math.floor(Math.random() * 100),
      }))
    } else {
      options = [{ name: `Option 1`, id: Math.random() }]
    }
  }

  const removeInput = idx => {
    values = values.filter((e, i) => i !== idx)
    options = options.filter((e, i) => i !== idx)
  }

  const addNewInput = () => {
    options = [
      ...options,
      { name: `Option ${values.length + 1}`, id: Math.random() },
    ]
    values = [...values, `Option ${values.length + 1}`]
  }

  const handleDndConsider = e => {
    options = e.detail.items
  }
  const handleDndFinalize = e => {
    options = e.detail.items
    values = options.map(option => option.name)
  }
  $: console.log(options)
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
          <ColorPicker size="S" value={"red"} on:change />
        </div>
        <div class="child">
          <input
            class="input-field"
            type="text"
            on:change={e => {
              values[idx] = e.target.value
              options[idx].name = e.target.value
            }}
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
    background-color: var(--spectrum-global-color-gray-100);
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

  .drag-handle-spacing {
  }
</style>
