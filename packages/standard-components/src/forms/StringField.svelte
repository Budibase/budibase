<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { getContext } from "svelte"
  import SpectrumField from "./SpectrumField.svelte"

  export let field
  export let label
  export let placeholder
  export let type = "text"

  // Register this field with its form
  const { formApi } = getContext("form") ?? {}
  const formField = formApi?.registerField(field) ?? {}
  const { fieldApi, fieldState } = formField

  // Update value on blur only
  const onBlur = event => {
    fieldApi.setValue(event.target.value)
  }
</script>

<SpectrumField {label} {field}>
  <div class="spectrum-Textfield" class:is-invalid={!$fieldState.valid}>
    {#if !$fieldState.valid}
      <svg
        class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
        focusable="false"
        aria-hidden="true">
        <use xlink:href="#spectrum-icon-18-Alert" />
      </svg>
    {/if}
    <input
      id={$fieldState.fieldId}
      value={$fieldState.value || ''}
      placeholder={placeholder || ''}
      on:blur={onBlur}
      {type}
      class="spectrum-Textfield-input" />
  </div>
</SpectrumField>
