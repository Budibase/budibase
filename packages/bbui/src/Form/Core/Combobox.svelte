<script>
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import clickOutside from "../../Actions/click_outside"

  export let value = null
  export let id = null
  export let placeholder = "Choose an option or type"
  export let disabled = false
  export let readonly = false
  export let error = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()
  let open = false
  let focus = false

  const selectOption = value => {
    dispatch("change", value)
    open = false
  }

  const onType = e => {
    const value = e.target.value
    dispatch("type", value)
    selectOption(value)
  }

  const onPick = value => {
    dispatch("pick", value)
    selectOption(value)
  }
</script>

<div
  class="spectrum-InputGroup"
  class:is-focused={open || focus}
  class:is-invalid={!!error}
  class:is-disabled={disabled}
>
  <div
    class="spectrum-Textfield spectrum-InputGroup-textfield"
    class:is-invalid={!!error}
    class:is-disabled={disabled}
    class:is-focused={open || focus}
  >
    <input
      {id}
      type="text"
      on:focus={() => (focus = true)}
      on:blur={() => {
        focus = false
        dispatch("blur")
      }}
      on:change={onType}
      value={value || ""}
      placeholder={placeholder || ""}
      {disabled}
      {readonly}
      class="spectrum-Textfield-input spectrum-InputGroup-input"
    />
  </div>
  <button
    class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
    tabindex="-1"
    aria-haspopup="true"
    {disabled}
    on:click={() => (open = true)}
  >
    <svg
      class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon spectrum-InputGroup-icon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Chevron100" />
    </svg>
  </button>
  {#if open}
    <div
      class="spectrum-Popover spectrum-Popover--bottom is-open"
      use:clickOutside={() => {
        open = false
      }}
    >
      <ul class="spectrum-Menu" role="listbox">
        {#if options && Array.isArray(options)}
          {#each options as option}
            <li
              class="spectrum-Menu-item"
              class:is-selected={getOptionValue(option) === value}
              role="option"
              aria-selected="true"
              tabindex="0"
              on:click={() => onPick(getOptionValue(option))}
            >
              <span class="spectrum-Menu-itemLabel"
                >{getOptionLabel(option)}</span
              >
              <svg
                class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
                focusable="false"
                aria-hidden="true"
              >
                <use xlink:href="#spectrum-css-icon-Checkmark100" />
              </svg>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
</div>

<style>
  .spectrum-InputGroup {
    min-width: 0;
    width: 100%;
  }
  .spectrum-Textfield {
    width: 100%;
  }
  .spectrum-Textfield-input {
    width: 0;
  }
  .spectrum-Popover {
    max-height: 240px;
    width: 100%;
    z-index: 999;
    top: 100%;
  }
</style>
