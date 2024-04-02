<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import "@spectrum-css/stepper/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let placeholder = null
  export let disabled = false
  export let id = null
  export let readonly = false
  export let updateOnChange = true
  export let quiet = false
  export let min
  export let max
  export let step

  const dispatch = createEventDispatcher()
  let focus = false

  // We need to keep the field value bound to a different variable in order
  // to properly handle erroneous values. If we don't do this then it is
  // possible for the field to show stale text which does not represent the
  // real value. The reactive statement is to ensure that external changes to
  // the value prop are reflected.
  let fieldValue = value
  $: fieldValue = value

  // Ensure step is always a numeric value defaulting to 1
  $: step = step == null || isNaN(step) ? 1 : step

  const updateValue = value => {
    if (readonly) {
      return
    }
    const float = parseFloat(value)
    value = isNaN(float) ? null : float
    if (value != null) {
      if (min != null && value < min) {
        value = min
      } else if (max != null && value > max) {
        value = max
      }
    }
    dispatch("change", value)
    fieldValue = value
  }

  const onFocus = () => {
    if (readonly) {
      return
    }
    focus = true
  }

  const onBlur = event => {
    if (readonly) {
      return
    }
    focus = false
    updateValue(event.target.value)
  }

  const onInput = event => {
    if (readonly || !updateOnChange) {
      return
    }
    updateValue(event.target.value)
  }

  const updateValueOnEnter = event => {
    if (readonly) {
      return
    }
    if (event.key === "Enter") {
      updateValue(event.target.value)
    }
  }

  const stepUp = () => {
    if (value == null || isNaN(value)) {
      updateValue(step)
    } else {
      updateValue(value + step)
    }
  }

  const stepDown = () => {
    if (value == null || isNaN(value)) {
      updateValue(step)
    } else {
      updateValue(value - step)
    }
  }
</script>

<div
  class="spectrum-Stepper"
  class:spectrum-Stepper--quiet={quiet}
  class:is-disabled={disabled}
  class:is-focused={focus}
>
  <div class="spectrum-Textfield spectrum-Stepper-textfield">
    <input
      {disabled}
      {readonly}
      {id}
      bind:value={fieldValue}
      placeholder={placeholder || ""}
      type="number"
      class="spectrum-Textfield-input spectrum-Stepper-input"
      on:click
      on:blur
      on:focus
      on:input
      on:keyup
      on:blur={onBlur}
      on:focus={onFocus}
      on:input={onInput}
      on:keyup={updateValueOnEnter}
    />
  </div>
  <span class="spectrum-Stepper-buttons">
    <button
      class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-Stepper-stepUp"
      tabindex="-1"
      on:click={stepUp}
    >
      <svg
        class="spectrum-Icon spectrum-UIIcon-ChevronUp75"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-css-icon-Chevron75" />
      </svg>
    </button>
    <button
      class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-Stepper-stepDown"
      tabindex="-1"
      on:click={stepDown}
    >
      <svg
        class="spectrum-Icon spectrum-UIIcon-ChevronDown75"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-css-icon-Chevron75" />
      </svg>
    </button>
  </span>
</div>

<style>
  .spectrum-Stepper {
    width: 100%;
  }
  .spectrum-Stepper::before {
    display: none;
  }
</style>
