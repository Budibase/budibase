<script>
  import "@spectrum-css/picker/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { fly } from "svelte/transition"
  import { createEventDispatcher } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Search from "./Search.svelte"

  export let id = null
  export let disabled = false
  export let error = null
  export let fieldText = ""
  export let fieldIcon = ""
  export let isPlaceholder = false
  export let placeholderOption = null
  export let options = []
  export let isOptionSelected = () => false
  export let onSelectOption = () => {}
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let getOptionIcon = () => null
  export let open = false
  export let readonly = false
  export let quiet = false
  export let autoWidth = false
  export let autocomplete = false
  export let sort = false

  const dispatch = createEventDispatcher()
  let searchTerm = null

  $: sortedOptions = getSortedOptions(options, getOptionLabel, sort)
  $: filteredOptions = getFilteredOptions(
    sortedOptions,
    searchTerm,
    getOptionLabel
  )

  const onClick = () => {
    dispatch("click")
    if (readonly) {
      return
    }
    searchTerm = null
    open = !open
  }

  const getSortedOptions = (options, getLabel, sort) => {
    if (!options?.length || !Array.isArray(options)) {
      return []
    }
    if (!sort) {
      return options
    }
    return options.sort((a, b) => {
      const labelA = getLabel(a)
      const labelB = getLabel(b)
      return labelA > labelB ? 1 : -1
    })
  }

  const getFilteredOptions = (options, term, getLabel) => {
    if (autocomplete && term) {
      const lowerCaseTerm = term.toLowerCase()
      return options.filter(option => {
        return `${getLabel(option)}`.toLowerCase().includes(lowerCaseTerm)
      })
    }
    return options
  }
</script>

<div use:clickOutside={() => (open = false)}>
  <button
    {id}
    class="spectrum-Picker spectrum-Picker--sizeM"
    class:spectrum-Picker--quiet={quiet}
    {disabled}
    class:is-invalid={!!error}
    class:is-open={open}
    aria-haspopup="listbox"
    on:mousedown={onClick}
  >
    {#if fieldIcon}
      <span class="icon-Placeholder-Padding">
        <img src={fieldIcon} alt="icon" width="20" height="15" />
      </span>
    {/if}

    <span
      class="spectrum-Picker-label"
      class:is-placeholder={isPlaceholder}
      class:auto-width={autoWidth}
    >
      {fieldText}
    </span>
    {#if error}
      <svg
        class="spectrum-Icon spectrum-Icon--sizeM spectrum-Picker-validationIcon"
        focusable="false"
        aria-hidden="true"
        aria-label="Folder"
      >
        <use xlink:href="#spectrum-icon-18-Alert" />
      </svg>
    {/if}
    <svg
      class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Chevron100" />
    </svg>
  </button>
  {#if open}
    <div
      transition:fly|local={{ y: -20, duration: 200 }}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
      class:auto-width={autoWidth}
    >
      {#if autocomplete}
        <Search
          value={searchTerm}
          on:change={event => (searchTerm = event.detail)}
          {disabled}
          placeholder="Search"
        />
      {/if}
      <ul class="spectrum-Menu" role="listbox">
        {#if placeholderOption}
          <li
            class="spectrum-Menu-item placeholder"
            class:is-selected={isPlaceholder}
            role="option"
            aria-selected="true"
            tabindex="0"
            on:click={() => onSelectOption(null)}
          >
            <span class="spectrum-Menu-itemLabel">{placeholderOption}</span>
            <svg
              class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
              focusable="false"
              aria-hidden="true"
            >
              <use xlink:href="#spectrum-css-icon-Checkmark100" />
            </svg>
          </li>
        {/if}
        {#if filteredOptions.length}
          {#each filteredOptions as option, idx}
            <li
              class="spectrum-Menu-item"
              class:is-selected={isOptionSelected(getOptionValue(option, idx))}
              role="option"
              aria-selected="true"
              tabindex="0"
              on:click={() => onSelectOption(getOptionValue(option, idx))}
            >
              {#if getOptionIcon(option, idx)}
                <span class="icon-Padding">
                  <img
                    src={getOptionIcon(option, idx)}
                    alt="icon"
                    width="20"
                    height="15"
                  />
                </span>
              {/if}
              <span class="spectrum-Menu-itemLabel">
                {getOptionLabel(option, idx)}
              </span>
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
  .spectrum-Popover {
    max-height: 240px;
    z-index: 999;
    top: 100%;
  }
  .spectrum-Popover:not(.auto-width) {
    width: 100%;
  }
  .spectrum-Popover.auto-width :global(.spectrum-Menu-itemLabel) {
    white-space: nowrap;
  }
  .spectrum-Picker {
    width: 100%;
  }
  .spectrum-Picker-label:not(.auto-width) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 0;
  }
  .placeholder {
    font-style: italic;
  }
  .spectrum-Picker-label.auto-width.is-placeholder {
    padding-right: 2px;
  }

  .icon-Padding {
    padding-right: 10px;
  }
  .icon-Placeholder-Padding {
    padding-top: 5px;
    padding-right: 10px;
  }
  .spectrum-Popover :global(.spectrum-Search) {
    margin-top: -1px;
    margin-left: -1px;
    width: calc(100% + 2px);
  }
  .spectrum-Popover :global(.spectrum-Search input) {
    height: auto;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding-top: var(--spectrum-global-dimension-size-100);
    padding-bottom: var(--spectrum-global-dimension-size-100);
  }
  .spectrum-Popover :global(.spectrum-Search .spectrum-ClearButton) {
    right: 1px;
    top: 2px;
  }
  .spectrum-Popover :global(.spectrum-Search .spectrum-Textfield-icon) {
    top: 9px;
  }
</style>
