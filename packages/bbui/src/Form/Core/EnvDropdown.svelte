<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher, onMount } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Divider from "../../Divider/Divider.svelte"
  import Body from "../../Typography/Body.svelte"
  export let value = null
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let id = null
  export let readonly = false
  export let updateOnChange = true
  export let dataCy
  export let align
  export let autofocus = false
  export let variables
  export let showModal
  $: console.log(showModal)
  const dispatch = createEventDispatcher()

  let field
  let focus = false
  let open = false

  const updateValue = newValue => {
    if (readonly) {
      return
    }
    if (type === "number") {
      const float = parseFloat(newValue)
      newValue = isNaN(float) ? null : float
    }
    dispatch("change", newValue)
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

  const handleOutsideClick = event => {
    if (open) {
      event.stopPropagation()
      open = false
      dispatch("closed")
    }
  }

  const handleVarSelect = variable => {
    console.log(variable)
    open = false
    updateValue(`{{ ${variable} }}`)
  }

  onMount(() => {
    focus = autofocus
    if (focus) field.focus()
  })
</script>

<div class="spectrum-InputGroup">
  <div
    class:is-focused={focus}
    class="spectrum-Textfield spectrum-InputGroup-textfield "
  >
    <svg
      class="hoverable icon-position spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
      focusable="false"
      aria-hidden="true"
      on:click={() => (open = true)}
    >
      <use xlink:href="#spectrum-icon-18-Key" />
    </svg>

    <input
      bind:this={field}
      {disabled}
      {readonly}
      {id}
      data-cy={dataCy}
      value={value || ""}
      placeholder={placeholder || ""}
      on:click
      on:blur
      on:focus
      on:input
      on:keyup
      on:blur={onBlur}
      on:focus={onFocus}
      on:input={onInput}
      on:keyup={updateValueOnEnter}
      {type}
      class="spectrum-Textfield-input"
      style={align ? `text-align: ${align};` : ""}
      inputmode={type === "number" ? "decimal" : "text"}
    />
  </div>
  {#if open}
    <div
      use:clickOutside={handleOutsideClick}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
    >
      <ul class="spectrum-Menu" role="listbox">
        {#if variables.length}
          {#each variables as variable, idx}
            <li
              class="spectrum-Menu-item"
              role="option"
              aria-selected="true"
              tabindex="0"
              on:click={() => handleVarSelect(variable.name)}
            >
              <span class="spectrum-Menu-itemLabel">
                <div class="primary-text">
                  {variable.name}
                  <span />
                </div>
                <svg
                  class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
                  focusable="false"
                  aria-hidden="true"
                >
                  <use xlink:href="#spectrum-css-icon-Checkmark100" />
                </svg>
              </span>
            </li>
          {/each}
        {:else}
          <li class="spectrum-Menu-item" role="option" aria-selected="true">
            <span class="spectrum-Menu-itemLabel">
              <div class="primary-text">
                You don't have any environment variables yet
              </div>
            </span>
          </li>
        {/if}
      </ul>
      <Divider noMargin />
      <div class="add-variable">
        <svg
          class="spectrum-Icon spectrum-Icon--sizeS "
          focusable="false"
          aria-hidden="true"
        >
          <use xlink:href="#spectrum-icon-18-Add" />
        </svg>
        <div on:click={() => showModal()} class="primary-text">
          <Body size="S">Add Variable</Body>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }
  input:disabled {
    color: var(--spectrum-global-color-gray-600) !important;
    -webkit-text-fill-color: var(--spectrum-global-color-gray-600) !important;
  }

  .icon-position {
    position: absolute;
    top: 20%;
    right: 2%;
  }

  .hoverable:hover {
    cursor: pointer;
    color: var(--spectrum-global-color-blue-400);
  }

  .primary-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .spectrum-InputGroup {
    min-width: 0;
    width: 100%;
  }
  .spectrum-InputGroup :global(.spectrum-Search-input) {
    border: none;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .spectrum-Popover {
    max-height: 240px;
    z-index: 999;
    top: 100%;
  }

  .spectrum-Popover.spectrum-Popover--bottom.spectrum-Picker-popover.is-open {
    width: 100%;
  }

  /* Fix focus borders to show only when opened */
  .spectrum-Textfield-input {
    border-color: var(--spectrum-global-color-gray-400) !important;
    border-right-width: 1px;
  }

  .add-variable {
    display: flex;
    padding: var(--spacing-m) 0 var(--spacing-m) var(--spacing-m);
    align-items: center;
    gap: var(--spacing-s);
  }
</style>
