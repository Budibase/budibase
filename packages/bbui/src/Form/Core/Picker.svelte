<script>
  import "@spectrum-css/picker/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { fly } from "svelte/transition"
  import { createEventDispatcher } from "svelte"
  import clickOutside from "../../Actions/click_outside"

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
  const dispatch = createEventDispatcher()
  const onClick = () => {
    dispatch("click")
    if (readonly) {
      return
    }
    open = true
  }
</script>

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
    use:clickOutside={() => (open = false)}
    transition:fly={{ y: -20, duration: 200 }}
    class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
    class:auto-width={autoWidth}
  >
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
      {#if options && Array.isArray(options)}
        {#each options as option, idx}
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
            <span class="spectrum-Menu-itemLabel"
              >{getOptionLabel(option, idx)}</span
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
</style>
