<script>
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Popover from "../../Popover/Popover.svelte"

  export let value = null
  export let id = null
  export let placeholder = "Choose an option or type"
  export let disabled = false
  export let readonly = false
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()

  let open = false
  let focus = false
  let anchor

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
  class:is-disabled={disabled}
  bind:this={anchor}
>
  <div
    class="spectrum-Textfield spectrum-InputGroup-textfield"
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
    on:click={() => (open = !open)}
  >
    <svg
      class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon spectrum-InputGroup-icon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Chevron100" />
    </svg>
  </button>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<Popover
  {anchor}
  {open}
  align="left"
  on:close={() => (open = false)}
  useAnchorWidth
>
  <div class="popover-content" use:clickOutside={() => (open = false)}>
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
            <span class="spectrum-Menu-itemLabel">{getOptionLabel(option)}</span
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
</Popover>

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

  /* Popover */
  .popover-content {
    display: contents;
  }
  .popover-content:not(.auto-width) .spectrum-Menu-itemLabel {
    width: 0;
    flex: 1 1 auto;
  }
</style>
