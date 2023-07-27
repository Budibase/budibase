<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher, onMount } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Divider from "../../Divider/Divider.svelte"

  export let value = null
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let id = null
  export let readonly = false
  export let updateOnChange = true
  export let align
  export let autofocus = false
  export let variables
  export let showModal
  export let environmentVariablesEnabled
  export let handleUpgradePanel
  const dispatch = createEventDispatcher()

  let field
  let focus = false
  let iconFocused = false
  let open = false

  //eslint-disable-next-line
  const STRIP_NAME_REGEX = /(\w+?)(?=\ })/g

  // Strips the name out of the value which is {{ env.Variable }} resulting in an array like ["Variable"]
  $: hbsValue = String(value)?.match(STRIP_NAME_REGEX) || []

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

  const handleOutsideClick = event => {
    if (open) {
      event.stopPropagation()
      open = false
      focus = false
      iconFocused = false
      dispatch("closed")
    }
  }

  const handleVarSelect = variable => {
    open = false
    focus = false
    iconFocused = false
    updateValue(`{{ env.${variable} }}`)
  }

  onMount(() => {
    focus = autofocus
    if (focus) field.focus()
  })

  function removeVariable() {
    updateValue("")
  }

  function openPopover() {
    open = true
    focus = true
    iconFocused = true
  }
</script>

<div class="spectrum-InputGroup">
  <div
    class:is-disabled={disabled || hbsValue.length}
    class:is-focused={focus}
    class="spectrum-Textfield"
  >
    <svg
      class:close-color={hbsValue.length}
      class:focused={iconFocused}
      class="hoverable icon-position spectrum-Icon spectrum-Icon--sizeS spectrum-Textfield-validationIcon"
      focusable="false"
      aria-hidden="true"
      on:click={() => {
        hbsValue.length ? removeVariable() : openPopover()
      }}
    >
      <use
        xlink:href={`#spectrum-icon-18-${!hbsValue.length ? "Key" : "Close"}`}
      />
    </svg>

    <input
      bind:this={field}
      disabled={hbsValue.length || disabled}
      {readonly}
      {id}
      value={hbsValue.length ? `{{ ${hbsValue[0]} }}` : value}
      placeholder={placeholder || ""}
      on:click
      on:blur
      on:focus
      on:input
      on:keyup
      on:blur={onBlur}
      on:focus={onFocus}
      on:input={onInput}
      type={hbsValue.length ? "text" : type}
      style={align ? `text-align: ${align};` : ""}
      class="spectrum-Textfield-input"
      inputmode={type === "number" ? "decimal" : "text"}
    />
  </div>
  {#if open}
    <div
      use:clickOutside={handleOutsideClick}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
    >
      <ul class="spectrum-Menu" role="listbox">
        {#if !environmentVariablesEnabled}
          <div class="no-variables-text primary-text">
            Upgrade your plan to get environment variables
          </div>
        {:else if variables.length}
          <div style="max-height: 100px">
            {#each variables as variable}
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
          </div>
        {:else}
          <div class="no-variables-text primary-text">
            You don't have any environment variables yet
          </div>
        {/if}
      </ul>
      <Divider noMargin />
      {#if environmentVariablesEnabled}
        <div on:click={() => showModal()} class="add-variable">
          <svg
            class="spectrum-Icon spectrum-Icon--sizeS "
            focusable="false"
            aria-hidden="true"
          >
            <use xlink:href="#spectrum-icon-18-Add" />
          </svg>
          <div class="primary-text">Add Variable</div>
        </div>
      {:else}
        <div on:click={() => handleUpgradePanel()} class="add-variable">
          <svg
            class="spectrum-Icon spectrum-Icon--sizeS "
            focusable="false"
            aria-hidden="true"
          >
            <use xlink:href="#spectrum-icon-18-ArrowUp" />
          </svg>
          <div class="primary-text">Upgrade plan</div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }

  .icon-position {
    position: absolute;
    top: 25%;
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

  .spectrum-Popover {
    max-height: 240px;
    z-index: 999;
    top: 100%;
  }

  .spectrum-Popover.spectrum-Popover--bottom.spectrum-Picker-popover.is-open {
    width: 100%;
  }

  .no-variables-text {
    padding: var(--spacing-m);
    color: var(--spectrum-global-color-gray-600);
  }

  .add-variable {
    display: flex;
    padding: var(--spacing-m) 0 var(--spacing-m) var(--spacing-m);
    align-items: center;
    gap: var(--spacing-s);
    cursor: pointer;
  }

  .focused {
    color: var(--spectrum-global-color-blue-400);
  }

  .add-variable:hover {
    background: var(--grey-1);
  }

  .close-color {
    color: var(--spectrum-global-color-gray-900) !important;
  }

  .close-color:hover {
    color: var(--spectrum-global-color-blue-400) !important;
  }
</style>
