<script>
  import Placeholder from "../Placeholder.svelte"
  import { getContext, onDestroy } from "svelte"
  import { Icon } from "@budibase/bbui"

  export let label
  export let field
  export let fieldState
  export let fieldApi
  export let fieldSchema
  export let defaultValue
  export let type
  export let disabled = false
  export let readonly = false
  export let validation
  export let span = 6
  export let helpText = null

  // Get contexts
  const formContext = getContext("form")
  const formStepContext = getContext("form-step")
  const fieldGroupContext = getContext("field-group")
  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  // Register field with form
  const formApi = formContext?.formApi
  const labelPos = fieldGroupContext?.labelPosition || "above"

  let touched = false
  let labelNode

  $: formStep = formStepContext ? $formStepContext || 1 : 1
  $: formField = formApi?.registerField(
    field,
    type,
    defaultValue,
    disabled,
    readonly,
    validation,
    formStep
  )
  $: schemaType =
    fieldSchema?.type !== "formula" && fieldSchema?.type !== "bigint"
      ? fieldSchema?.type
      : "string"

  // Focus label when editing
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
    if (touched) {
      builderStore.actions.updateProp("label", e.target.textContent)
    }
    touched = false
  }

  onDestroy(() => {
    fieldApi?.deregister()
    unsubscribe?.()
  })
</script>

<div
  class="spectrum-Form-item"
  class:span-2={span === 2}
  class:span-3={span === 3}
  class:span-6={span === 6 || !span}
  use:styleable={$component.styles}
  class:above={labelPos === "above"}
>
  {#key $component.editing}
    <label
      bind:this={labelNode}
      contenteditable={$component.editing}
      on:blur={$component.editing ? updateLabel : null}
      on:input={() => (touched = true)}
      class:hidden={!label}
      class:readonly
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
        <div class="error">
          <Icon name="Alert" />
          <span>{fieldState.error}</span>
        </div>
      {:else if helpText}
        <div class="helpText">
          <Icon name="HelpOutline" /> <span>{helpText}</span>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  :global(.form-block .spectrum-Form-item.span-2) {
    grid-column: span 2;
  }
  :global(.form-block .spectrum-Form-item.span-3) {
    grid-column: span 3;
  }
  :global(.form-block .spectrum-Form-item.span-6) {
    grid-column: span 6;
  }
  .spectrum-Form-item.above {
    display: flex;
    flex-direction: column;
  }
  label {
    word-wrap: break-word;
  }
  label.hidden {
    padding: 0;
  }
  .spectrum-Form-itemField {
    position: relative;
    width: 100%;
  }

  .error :global(svg),
  .helpText :global(svg) {
    width: 13px;
    margin-right: 6px;
  }

  .error {
    display: flex;
    margin-top: var(--spectrum-global-dimension-size-75);
    align-items: center;
  }
  .error :global(svg) {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
  }
  .error span {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
    font-size: var(--spectrum-global-dimension-font-size-75);
  }

  .helpText {
    display: flex;
    margin-top: var(--spectrum-global-dimension-size-75);
    align-items: center;
  }
  .helpText :global(svg) {
    color: var(--spectrum-global-color-gray-600);
  }
  .helpText span {
    color: var(--spectrum-global-color-gray-800);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }

  .spectrum-FieldLabel--right,
  .spectrum-FieldLabel--left {
    padding-right: var(--spectrum-global-dimension-size-200);
  }
  .readonly {
    pointer-events: none;
  }
</style>
