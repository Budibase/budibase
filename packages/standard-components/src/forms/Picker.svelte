<script>
  import "@spectrum-css/picker/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { fly } from "svelte/transition"

  export let fieldState
  export let fieldText = ""
  export let isPlaceholder = false
  export let placeholderOption = null
  export let options = []
  export let isOptionSelected = () => false
  export let onSelectOption = () => {}
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let open = false
</script>

{#if fieldState}
  <button
    id={$fieldState.fieldId}
    class="spectrum-Picker spectrum-Picker--sizeM"
    disabled={$fieldState.disabled}
    class:is-invalid={!$fieldState.valid}
    class:is-open={open}
    aria-haspopup="listbox"
    on:click={() => (open = true)}>
    <span class="spectrum-Picker-label" class:is-placeholder={isPlaceholder}>
      {fieldText}
    </span>
    {#if !$fieldState.valid}
      <svg
        class="spectrum-Icon spectrum-Icon--sizeM spectrum-Picker-validationIcon"
        focusable="false"
        aria-hidden="true"
        aria-label="Folder">
        <use xlink:href="#spectrum-icon-18-Alert" />
      </svg>
    {/if}
    <svg
      class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon"
      focusable="false"
      aria-hidden="true">
      <use xlink:href="#spectrum-css-icon-Chevron100" />
    </svg>
  </button>
  {#if open}
    <div class="overlay" on:mousedown|self={() => (open = false)} />
    <div
      transition:fly={{ y: -20, duration: 200 }}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open">
      <ul class="spectrum-Menu" role="listbox">
        {#if placeholderOption}
          <li
            class="spectrum-Menu-item"
            class:is-selected={isPlaceholder}
            role="option"
            aria-selected="true"
            tabindex="0"
            on:click={() => onSelectOption(null)}>
            <span class="spectrum-Menu-itemLabel">{placeholderOption}</span>
            <svg
              class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
              focusable="false"
              aria-hidden="true">
              <use xlink:href="#spectrum-css-icon-Checkmark100" />
            </svg>
          </li>
        {/if}
        {#each options as option}
          <li
            class="spectrum-Menu-item"
            class:is-selected={isOptionSelected(getOptionValue(option))}
            role="option"
            aria-selected="true"
            tabindex="0"
            on:click={() => onSelectOption(getOptionValue(option))}>
            <span
              class="spectrum-Menu-itemLabel">{getOptionLabel(option)}</span>
            <svg
              class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
              focusable="false"
              aria-hidden="true">
              <use xlink:href="#spectrum-css-icon-Checkmark100" />
            </svg>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
{/if}

<style>
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
  }
  .spectrum-Picker {
    width: 100%;
  }
</style>
