<script>
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { fly } from "svelte/transition"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let id = null
  export let placeholder = "Choose an option"
  export let disabled = false
  export let error = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()
  let open = false
  let focus = false
  $: fieldText = getFieldText(value, options, placeholder)

  const getFieldText = (value, options, placeholder) => {
    // Always use placeholder if no value
    if (value == null || value === "") {
      return placeholder || "Choose an option"
    }

    // Wait for options to load if there is a value but no options
    if (!options?.length) {
      return ""
    }

    // Render the label if the selected option is found, otherwise raw value
    const selected = options.find(option => getOptionValue(option) === value)
    return selected ? getOptionLabel(selected) : value
  }

  const selectOption = value => {
    dispatch("change", value)
    open = false
  }

  const onChange = e => {
    selectOption(e.target.value)
  }
</script>

<div class="spectrum-InputGroup" class:is-focused={open || focus}>
  <div
    class="spectrum-Textfield spectrum-InputGroup-textfield"
    class:is-disabled={!!error}
    class:is-focused={open || focus}
  >
    <input
      type="text"
      on:focus={() => (focus = true)}
      on:blur={() => (focus = false)}
      on:change={onChange}
      {value}
      {placeholder}
      class="spectrum-Textfield-input spectrum-InputGroup-input"
    />
  </div>
  <button
    class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
    tabindex="-1"
    aria-haspopup="true"
    disabled={!!error}
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
    <div class="overlay" on:mousedown|self={() => (open = false)} />
    <div
      transition:fly={{ y: -20, duration: 200 }}
      class="spectrum-Popover spectrum-Popover--bottom is-open"
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
              on:click={() => selectOption(getOptionValue(option))}
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
  .spectrum-Textfield-input {
    width: 0;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }
  .spectrum-Popover {
    max-height: 240px;
    width: 100%;
    z-index: 999;
    top: 100%;
  }
</style>
