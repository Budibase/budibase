<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { Label } from "@budibase/bbui"
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  export let field
  export let label
  export let placeholder
  export let type = "text"

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const { formApi } = getContext("form") ?? {}

  // Register this field with its form
  const formField = formApi?.registerField(field, validate) ?? {}
  const { fieldApi, fieldState } = formField

  // Update value on blur only
  const onBlur = event => {
    fieldApi.setValue(event.target.value)
  }
</script>

{#if !field}
  <Placeholder>Add the Field setting to start using your component</Placeholder>
{:else if !fieldState}
  <Placeholder>Form components need to be wrapped in a Form</Placeholder>
{:else}
  <div class="container" use:styleable={$component.styles}>
    {#if label}
      <Label grey>{label}</Label>
    {/if}
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
        value={$fieldState.value || ''}
        placeholder={placeholder || ''}
        on:blur={onBlur}
        {type}
        class="spectrum-Textfield-input" />
    </div>
    {#if $fieldState.error}
      <div class="error">
        <Label>{$fieldState.error}</Label>
      </div>
    {/if}
  </div>
{/if}

<style>
  .error :global(label) {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    ) !important;
    margin-top: var(--spacing-s) !important;
    margin-bottom: 0 !important;
  }
</style>
