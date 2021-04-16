<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = ""
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let id = null

  const dispatch = createEventDispatcher()

  const onChange = event => {
    dispatch("change", event.target.value)
  }
</script>

<div
  class="spectrum-Textfield spectrum-Textfield--multiline"
  class:is-invalid={!!error}
  class:is-disabled={disabled}>
  {#if error}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
      focusable="false"
      aria-hidden="true">
      <use xlink:href="#spectrum-icon-18-Alert" />
    </svg>
  {/if}
  <textarea
    placeholder={placeholder || ''}
    class="spectrum-Textfield-input"
    {disabled}
    {id}
    on:blur={onChange}>{value || ''}</textarea>
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }
  textarea {
    resize: vertical;
    min-height: 80px !important;
  }
</style>
