<script>
  import Placeholder from "./Placeholder.svelte"
  import { getContext } from "svelte"

  export let label
  export let field

  const formContext = getContext("form")
  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const { labelPosition, formApi } = formContext || {}
  const formField = formApi?.registerField(field) ?? {}
  const { fieldId, fieldState } = formField

  $: labelPositionClass =
    labelPosition === "top" ? "" : `spectrum-FieldLabel--${labelPosition}`
</script>

{#if !fieldId}
  <Placeholder>Add the Field setting to start using your component</Placeholder>
{:else if !formContext}
  <Placeholder>Form components need to be wrapped in a Form</Placeholder>
{:else}
  <div class="spectrum-Form-item" use:styleable={$component.styles}>
    {#if label}
      <label
        for={fieldId}
        class={`spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel ${labelPositionClass}`}>
        {label}
      </label>
    {/if}
    <div class="spectrum-Form-itemField">
      <slot />
      {#if $fieldState.error}
        <div class="error">{$fieldState.error}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .error {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
    font-size: var(--spectrum-global-dimension-font-size-75);
    margin-top: var(--spectrum-global-dimension-size-75);
  }
</style>
