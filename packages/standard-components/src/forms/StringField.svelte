<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import SpectrumField from "./SpectrumField.svelte"

  export let field
  export let label
  export let placeholder
  export let type = "text"

  let fieldState
  let fieldApi

  const onBlur = event => {
    let value = event.target.value
    if (type === "number") {
      const float = parseFloat(value)
      value = isNaN(float) ? null : float
    }
    fieldApi.setValue(value)
  }
</script>

<SpectrumField {label} {field} bind:fieldState bind:fieldApi>
  {#if fieldState}
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
  {/if}
</SpectrumField>
