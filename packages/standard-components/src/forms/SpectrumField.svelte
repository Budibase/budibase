<script>
  import Placeholder from "./Placeholder.svelte"
  import FieldGroupFallback from "./FieldGroupFallback.svelte"
  import { getContext } from "svelte"

  export let label
  export let field
  export let fieldState
  export let fieldApi
  export let fieldSchema

  // Get contexts
  const formContext = getContext("form")
  const fieldGroupContext = getContext("fieldGroup")
  const { styleable } = getContext("sdk")
  const component = getContext("component")

  // Register field with form
  $: formApi = formContext?.formApi
  $: labelPosition = fieldGroupContext?.labelPosition || "above"
  $: formField = formApi?.registerField(field)

  // Expose field properties to parent component
  $: {
    fieldState = formField?.fieldState
    fieldApi = formField?.fieldApi
    fieldSchema = formField?.fieldSchema
  }

  // Extract label position from field group context
  $: labelPositionClass =
    labelPosition === "above" ? "" : `spectrum-FieldLabel--${labelPosition}`
</script>

<FieldGroupFallback>
  <div class="spectrum-Form-item" use:styleable={$component.styles}>
    <label
      for={$fieldState?.fieldId}
      class={`spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel ${labelPositionClass}`}>
      {label || ''}
    </label>
    <div class="spectrum-Form-itemField">
      {#if !formContext}
        <Placeholder>Form components need to be wrapped in a Form</Placeholder>
      {:else if !fieldState}
        <Placeholder>
          Add the Field setting to start using your component
        </Placeholder>
      {:else}
        <slot />
        {#if $fieldState.error}
          <div class="error">{$fieldState.error}</div>
        {/if}
      {/if}
    </div>
  </div>
</FieldGroupFallback>

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
