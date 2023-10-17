<script>
  import "@spectrum-css/search/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let placeholder = null
  export let disabled = false
  export let id = null
  export let updateOnChange = true
  export let quiet = false
  export let inputRef

  const dispatch = createEventDispatcher()
  let focus = false

  const updateValue = value => {
    dispatch("change", value)
  }

  const onFocus = () => {
    focus = true
  }

  const onBlur = event => {
    focus = false
    updateValue(event.target.value)
  }

  const onInput = event => {
    if (!updateOnChange) {
      return
    }
    updateValue(event.target.value)
  }

  const updateValueOnEnter = event => {
    if (event.key === "Enter") {
      updateValue(event.target.value)
    }
  }
</script>

<div class="spectrum-Search" class:is-disabled={disabled}>
  <div
    class="spectrum-Textfield"
    class:spectrum-Textfield--quiet={quiet}
    class:is-focused={focus}
    class:is-disabled={disabled}
  >
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-icon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-icon-18-Magnify" />
    </svg>
    <input
      {disabled}
      {id}
      value={value || ""}
      placeholder={placeholder || ""}
      on:click
      on:blur
      on:focus
      on:input
      on:blur={onBlur}
      on:focus={onFocus}
      on:input={onInput}
      on:keyup={updateValueOnEnter}
      type="search"
      class="spectrum-Textfield-input spectrum-Search-input"
      autocomplete="off"
      bind:this={inputRef}
    />
  </div>
  <button
    on:click={() => updateValue("")}
    type="reset"
    class="spectrum-ClearButton spectrum-Search-clearButton"
  >
    <svg
      class="spectrum-Icon spectrum-UIIcon-Cross75"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Cross75" />
    </svg>
  </button>
</div>

<style>
  .spectrum-Search,
  .spectrum-Textfield {
    width: 100%;
  }
  .spectrum-Search-input {
    padding-right: 24px;
  }
  .is-disabled {
    pointer-events: none;
  }
  .spectrum-Search-clearButton {
    position: absolute;
  }
</style>
