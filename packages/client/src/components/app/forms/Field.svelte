<script>
  import Placeholder from "../Placeholder.svelte"
  import FieldGroupFallback from "./FieldGroupFallback.svelte"
  import { getContext, onDestroy } from "svelte"

  export let label
  export let field
  export let fieldState
  export let fieldApi
  export let fieldSchema
  export let defaultValue
  export let type
  export let disabled = false
  export let validation

  // Get contexts
  const formContext = getContext("form")
  const formStepContext = getContext("form-step")
  const fieldGroupContext = getContext("field-group")
  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  // Register field with form
  const formApi = formContext?.formApi
  const labelPos = fieldGroupContext?.labelPosition || "above"
  $: formStep = formStepContext ? $formStepContext || 1 : 1
  $: formField = formApi?.registerField(
    field,
    type,
    defaultValue,
    disabled,
    validation,
    formStep
  )

  $: schemaType =
    fieldSchema?.type !== "formula" && fieldSchema?.type !== "bigint"
      ? fieldSchema?.type
      : "string"

  // Focus label when editing
  let labelNode
  $: $component.editing && labelNode?.focus()

  // Update form properties in parent component on every store change
  $: unsubscribe = formField?.subscribe(value => {
    fieldState = value?.fieldState
    fieldApi = value?.fieldApi
    fieldSchema = value?.fieldSchema
  })

  // Determine label class from position
  $: labelClass = labelPos === "above" ? "" : `spectrum-FieldLabel--${labelPos}`

  const updateLabel = e => {
    builderStore.actions.updateProp("label", e.target.textContent)
  }

  onDestroy(() => {
    fieldApi?.deregister()
    unsubscribe?.()
  })
</script>

<FieldGroupFallback>
  <div class="spectrum-Form-item" use:styleable={$component.styles}>
    {#key $component.editing}
      <label
        bind:this={labelNode}
        contenteditable={$component.editing}
        on:blur={$component.editing ? updateLabel : null}
        class:hidden={!label}
        for={fieldState?.fieldId}
        class={`spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel ${labelClass}`}
      >
        {label || " "}
      </label>
    {/key}
    <div class="spectrum-Form-itemField">
      {#if !formContext}
        <Placeholder text="Form components need to be wrapped in a form" />
      {:else if !fieldState}
        <Placeholder />
      {:else if schemaType && schemaType !== type && !["options", "longform"].includes(type)}
        <Placeholder
          text="This Field setting is the wrong data type for this component"
        />
      {:else}
        <slot />
        {#if fieldState.error}
          <div class="error">{fieldState.error}</div>
        {/if}
      {/if}
    </div>
  </div>
</FieldGroupFallback>

<style>
  label {
    white-space: nowrap;
  }
  label.hidden {
    padding: 0;
  }
  .spectrum-Form-itemField {
    position: relative;
    width: 100%;
  }
  .error {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
    font-size: var(--spectrum-global-dimension-font-size-75);
    margin-top: var(--spectrum-global-dimension-size-75);
  }
  .spectrum-FieldLabel--right,
  .spectrum-FieldLabel--left {
    padding-right: var(--spectrum-global-dimension-size-200);
  }
</style>
