<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import "@spectrum-css/stepper/dist/index-vars.css"
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

  $: numeric = type === "number"

  // Update value on blur only
  const onBlur = event => {
    fieldApi.setValue(event.target.value)
  }
</script>

<SpectrumField {label} {field}>
  <div class:spectrum-Stepper={type === 'number'}>
    <div
      class="spectrum-Textfield"
      class:spectrum-Stepper-textfield={numeric}
      class:is-invalid={!$fieldState.valid}>
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
        class="spectrum-Textfield-input"
        class:spectrum-Stepper-input={numeric} />
    </div>
    {#if numeric}
      <span class="spectrum-Stepper-buttons">
        <button
          class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-Stepper-stepUp"
          tabindex="-1">
          <svg
            class="spectrum-Icon spectrum-UIIcon-ChevronUp75 spectrum-Stepper-stepUpIcon"
            focusable="false"
            aria-hidden="true">
            <use xlink:href="#spectrum-css-icon-Chevron75" />
          </svg>
        </button>
        <button
          class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-Stepper-stepDown"
          tabindex="-1">
          <svg
            class="spectrum-Icon spectrum-UIIcon-ChevronDown75 spectrum-Stepper-stepDownIcon"
            focusable="false"
            aria-hidden="true">
            <use xlink:href="#spectrum-css-icon-Chevron75" />
          </svg>
        </button>
      </span>
    {/if}
    {#if $fieldState.error}
      <div class="error">{$fieldState.error}</div>
    {/if}
  </div>
</SpectrumField>

<style>
  .error {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    ) !important;
  }
</style>
