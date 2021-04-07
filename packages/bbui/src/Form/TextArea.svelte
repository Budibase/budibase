<script>
  import { createEventDispatcher } from "svelte"
  import Button from "../Button/Button.svelte"
  import Label from "../Styleguide/Label.svelte"
  import text_area_resize from "../Actions/autoresize_textarea.js"

  const dispatch = createEventDispatcher()

  export let name = false
  export let label = false
  export let thin = false
  export let extraThin = false
  export let edit = false
  export let disabled = false
  export let placeholder
  export let validator = () => {}
  export let value = ""
  export const getCaretPosition = () => {
    return { start: textarea.selectionStart, end: textarea.selectionEnd }
  }

  let textarea

  // This section handles the edit mode and dispatching of things to the parent when saved
  let editMode = false

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
  <textarea
    class:thin
    class:extraThin
    bind:value
    bind:this={textarea}
    on:change
    disabled={disabled || (edit && !editMode)}
    {placeholder}
    {name}
    use:text_area_resize />
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

  textarea {
    min-width: 0;
    color: var(--ink);
    font-size: var(--font-size-s);
    font-family: var(--font-sans);
    border: none;
    border-radius: var(--border-radius-s);
    background-color: var(--grey-2);
    padding: var(--spacing-m);
    margin: 0;
    border: var(--border-transparent);
    outline: none;
  }
  textarea::placeholder {
    color: var(--grey-6);
  }
  textarea.thin {
    font-size: var(--font-size-xs);
  }
  textarea.extraThin {
    font-size: var(--font-size-xs);
    padding: var(--spacing-s) var(--spacing-m);
  }
  textarea:focus {
    border: var(--border-blue);
  }
  textarea:disabled {
    background: var(--grey-4);
  }
  textarea:disabled {
    background: var(--grey-4);
  }
  textarea:disabled::placeholder {
    color: var(--grey-6);
  }
</style>
