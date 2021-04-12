<script>
  import { createEventDispatcher } from "svelte"
  import Button from "../Button/Button.svelte"
  import Label from "../Styleguide/Label.svelte"
  const dispatch = createEventDispatcher()

  export let name = undefined
  export let label = undefined
  export let outline = false
  export let presentation = false
  export let thin = false
  export let extraThin = false
  export let large = false
  export let border = false
  export let edit = false
  export let disabled = false
  export let type = undefined
  export let placeholder = ""
  export let value = ""
  export let error = false
  export let validator = () => {}

  // This section handles the edit mode and dispatching of things to the parent when saved
  let editMode = false

  const updateValue = e => {
    if (type === "number") {
      const num = parseFloat(e.target.value)
      value = isNaN(num) ? "" : num
    } else {
      value = e.target.value
    }
  }

  const save = () => {
    editMode = false
    dispatch("save", value)
  }

  const enableEdit = () => {
    editMode = true
  }
</script>

<div class="container">
  {#if label || edit}
    <div class="label-container">
      {#if label}
        <Label extraSmall grey forAttr={name}>{label}</Label>
      {/if}
      {#if edit}
        <div class="controls">
          <Button small secondary disabled={editMode} on:click={enableEdit}>
            Edit
          </Button>
          <Button small blue disabled={!editMode} on:click={save}>Save</Button>
        </div>
      {/if}
    </div>
  {/if}
  <input
    class:outline
    class:presentation
    class:thin
    class:extraThin
    class:large
    class:border
    on:change
    on:input
    on:change={updateValue}
    on:input={updateValue}
    on:blur={updateValue}
    use:validator
    disabled={disabled || (edit && !editMode)}
    value={value == null ? '' : value}
    {type}
    {name}
    {placeholder} />
  {#if error}
    <div class="error">{error}</div>
  {/if}
</div>

<style>
  .container {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .label-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: var(--spacing-s);
  }
  .label-container :global(label) {
    margin-bottom: 0;
  }

  .controls {
    align-items: center;
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 12px;
    margin-left: auto;
    padding-left: 12px;
  }
  .controls :global(button) {
    min-width: 100px;
    font-size: var(--font-size-s);
    border-radius: var(--rounded-small);
  }

  input {
    min-width: 0;
    box-sizing: border-box;
    color: var(--ink);
    font-size: var(--font-size-s);
    border-radius: var(--border-radius-s);
    border: none;
    background-color: var(--grey-2);
    padding: var(--spacing-m);
    margin: 0;
    outline: none;
    font-family: var(--font-sans);
    border: var(--border-transparent);
    transition: all 0.2s ease-in-out;
  }
  input.presentation {
    background-color: var(--background);
    border: var(--background) 2px solid;
  }
  input.presentation:hover {
    background-color: var(--grey-2);
    border: var(--grey-4) 2px solid;
  }
  input.thin {
    font-size: var(--font-size-xs);
  }
  input.extraThin {
    font-size: var(--font-size-xs);
    padding: var(--spacing-s) var(--spacing-m);
  }
  input.large {
    font-size: var(--font-size-m);
    padding: var(--spacing-l);
  }
  input.border {
    border: var(--border-grey-2);
  }
  input.border:active {
    border: var(--border-blue);
  }
  input.border:focus {
    border: var(--border-blue);
  }
  input.outline {
    border: var(--border-light-2);
    background: var(--background);
  }
  input.outline:active {
    border: var(--border-blue);
  }
  input.outline:focus {
    border: var(--border-blue);
  }
  input:hover {
    border: var(--grey-4) 2px solid;
  }
  input::placeholder {
    color: var(--grey-6);
  }
  input:focus {
    border: var(--border-blue);
  }
  input:disabled {
    background: var(--grey-4);
    color: var(--grey-6);
  }

  .error {
    margin-top: 10px;
    font-size: var(--font-size-xs);
    font-family: var(--font-sans);
    line-height: 1.17;
    color: var(--red);
  }
</style>
