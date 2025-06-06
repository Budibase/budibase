<script lang="ts">
  import "@spectrum-css/search/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import Icon from "../../Icon/Icon.svelte"

  export let value: any = null
  export let placeholder: string | undefined = undefined
  export let disabled = false
  export let id = null
  export let updateOnChange = true
  export let quiet = false
  export let inputRef: HTMLElement | undefined = undefined

  const dispatch = createEventDispatcher()
  let focus = false

  const updateValue = (value: any) => {
    dispatch("change", value)
  }

  const onFocus = () => {
    focus = true
  }

  const onBlur = (event: any) => {
    focus = false
    updateValue(event.target.value)
  }

  const onInput = (event: any) => {
    if (!updateOnChange) {
      return
    }
    updateValue(event.target.value)
  }

  const updateValueOnEnter = (event: any) => {
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
    <div class="search-icon">
      <Icon name="magnifying-glass" size="S" />
    </div>
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
    <Icon name="x" size="S" />
  </button>
</div>

<style>
  .spectrum-Search,
  .spectrum-Textfield {
    width: 100%;
  }
  .spectrum-Search-input {
    padding-left: 35px;
    padding-right: 24px;
  }
  .is-disabled {
    pointer-events: none;
  }
  .spectrum-Search-clearButton {
    position: absolute;
  }
  .search-icon {
    position: absolute;
    top: 9px;
    left: var(--spectrum-textfield-error-icon-margin-left);
  }
</style>
