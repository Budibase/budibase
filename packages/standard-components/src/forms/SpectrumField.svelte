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
  const { fieldId } = formField

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
    </div>
  </div>
{/if}
