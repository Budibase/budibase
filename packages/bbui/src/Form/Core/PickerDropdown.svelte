<script>
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { fly } from "svelte/transition"
  import { createEventDispatcher } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Icon from "../../Icon/Icon.svelte"
  import StatusLight from "../../StatusLight/StatusLight.svelte"
  import Detail from "../../Typography/Detail.svelte"

  export let primaryLabel = ""
  export let primaryValue = null
  export let id = null
  export let placeholder = "Choose an option or type"
  export let disabled = false
  export let readonly = false
  export let updateOnChange = true
  export let error = null
  export let secondaryOptions = []
  export let primaryOptions = []
  export let secondaryFieldText = ""
  export let secondaryFieldIcon = ""
  export let secondaryFieldColour = ""
  export let getPrimaryOptionLabel = option => option
  export let getPrimaryOptionValue = option => option
  export let getPrimaryOptionColour = () => null
  export let getPrimaryOptionIcon = () => null
  export let getSecondaryOptionLabel = option => option
  export let getSecondaryOptionValue = option => option
  export let getSecondaryOptionColour = () => null
  export let onSelectOption = () => {}
  export let autoWidth = false
  export let autocomplete = false
  export let isOptionSelected = () => false
  export let isPlaceholder = false
  export let placeholderOption = null

  const dispatch = createEventDispatcher()
  let primaryOpen = false
  let secondaryOpen = false
  let focus = false
  let searchTerm = null

  $: groupTitles = Object.keys(primaryOptions)
  $: filteredOptions = getFilteredOptions(
    primaryOptions,
    searchTerm,
    getPrimaryOptionLabel
  )
  let iconData
  /*
  $: iconData = primaryOptions?.find(x => {
    return x.name === primaryFieldText
  })
  */
  const updateValue = newValue => {
    if (readonly) {
      return
    }
    dispatch("change", newValue)
  }

  const onClickSecondary = () => {
    dispatch("click")
    if (readonly) {
      return
    }
    secondaryOpen = true
  }

  const onPickPrimary = newValue => {
    dispatch("pickprimary", newValue)
    primaryOpen = false
  }

  const onClearPrimary = () => {
    dispatch("pickprimary", null)
    primaryOpen = false
  }

  const onPickSecondary = newValue => {
    dispatch("picksecondary", newValue)
    secondaryOpen = false
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

<div
  class="spectrum-InputGroup"
  class:is-invalid={!!error}
  class:is-disabled={disabled}
>
  <div
    class="spectrum-Textfield spectrum-InputGroup-textfield"
    class:is-invalid={!!error}
    class:is-disabled={disabled}
    class:is-focused={focus}
    class:is-full-width={!secondaryOptions.length}
  >
    {#if iconData}
      <svg
        width="16px"
        height="16px"
        class="spectrum-Icon iconPadding"
        style="color: {iconData?.color}"
        focusable="false"
      >
        <use xlink:href="#spectrum-icon-18-{iconData?.icon}" />
      </svg>
    {/if}
    <input
      {id}
      on:click={() => (primaryOpen = true)}
      on:blur
      on:focus
      on:input
      on:keyup
      on:blur={onBlur}
      on:input={onInput}
      on:keyup={updateValueOnEnter}
      value={primaryLabel || ""}
      placeholder={placeholder || ""}
      {disabled}
      {readonly}
      class="spectrum-Textfield-input spectrum-InputGroup-input"
      class:labelPadding={iconData}
    />
    {#if primaryValue}
      <button
        on:click={() => onClearPrimary()}
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
    {/if}
  </div>
  {#if primaryOpen}
    <div
      use:clickOutside={() => (primaryOpen = false)}
      transition:fly|local={{ y: -20, duration: 200 }}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
      class:auto-width={autoWidth}
      class:is-full-width={!secondaryOptions.length}
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
        {#each groupTitles as title}
          <div class="spectrum-Menu-item">
            <Detail>{title}</Detail>
          </div>
          {#if primaryOptions}
            {#each primaryOptions[title].data as option, idx}
              <li
                class="spectrum-Menu-item"
                class:is-selected={isOptionSelected(
                  getPrimaryOptionValue(option, idx)
                )}
                role="option"
                aria-selected="true"
                tabindex="0"
                on:click={() =>
                  onPickPrimary({
                    value: primaryOptions[title].getValue(option),
                    label: primaryOptions[title].getLabel(option),
                  })}
              >
                {#if primaryOptions[title].getIcon(option)}
                  <div
                    style="background: {primaryOptions[title].getColour(
                      option
                    )};"
                    class="circle"
                  >
                    <div>
                      <Icon
                        size="S"
                        name={primaryOptions[title].getIcon(option)}
                      />
                    </div>
                  </div>
                {:else if getPrimaryOptionColour(option, idx)}
                  <span class="option-left">
                    <StatusLight color={getPrimaryOptionColour(option, idx)} />
                  </span>
                {/if}
                <span class="spectrum-Menu-itemLabel">
                  <span
                    class:spacing-group={primaryOptions[title].getIcon(option)}
                  >
                    {primaryOptions[title].getLabel(option)}
                    <span />
                  </span>
                  <svg
                    class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <use xlink:href="#spectrum-css-icon-Checkmark100" />
                  </svg>
                  {#if getPrimaryOptionIcon(option, idx) && getPrimaryOptionColour(option, idx)}
                    <span class="option-right">
                      <StatusLight
                        color={getPrimaryOptionColour(option, idx)}
                      />
                    </span>
                  {/if}
                </span>
              </li>
            {/each}
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
  {#if secondaryOptions.length}
    <div style="width: 30%">
      <button
        {id}
        class="spectrum-Picker spectrum-Picker--sizeM override-borders"
        {disabled}
        class:is-open={secondaryOpen}
        aria-haspopup="listbox"
        on:mousedown={onClickSecondary}
      >
        {#if secondaryFieldIcon}
          <span class="option-left">
            <Icon name={secondaryFieldIcon} />
          </span>
        {:else if secondaryFieldColour}
          <span class="option-left">
            <StatusLight color={secondaryFieldColour} />
          </span>
        {/if}

        <span class:auto-width={autoWidth} class="spectrum-Picker-label">
          {secondaryFieldText}
        </span>
        <svg
          class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon"
          focusable="false"
          aria-hidden="true"
        >
          <use xlink:href="#spectrum-css-icon-Chevron100" />
        </svg>
      </button>
      {#if secondaryOpen}
        <div
          use:clickOutside={() => (secondaryOpen = false)}
          transition:fly|local={{ y: -20, duration: 200 }}
          class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
          style="width: 30%"
        >
          <ul class="spectrum-Menu" role="listbox">
            {#each secondaryOptions as option, idx}
              <li
                class="spectrum-Menu-item"
                class:is-selected={isOptionSelected(
                  getSecondaryOptionValue(option, idx)
                )}
                role="option"
                aria-selected="true"
                tabindex="0"
                on:click={() =>
                  onPickSecondary(getSecondaryOptionValue(option, idx))}
              >
                {#if getSecondaryOptionColour(option, idx)}
                  <span class="option-left">
                    <StatusLight
                      color={getSecondaryOptionColour(option, idx)}
                    />
                  </span>
                {/if}

                <span class="spectrum-Menu-itemLabel">
                  {getSecondaryOptionLabel(option, idx)}
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
          </ul>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .spacing-group {
    margin-left: var(--spacing-m);
  }
  .spectrum-InputGroup {
    min-width: 0;
    width: 100%;
  }
  .override-borders {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  .spectrum-Popover {
    max-height: 240px;
    z-index: 999;
    top: 100%;
  }

  .option-left {
    padding-right: 8px;
  }
  .option-right {
    padding-left: 8px;
  }

  .circle {
    border-radius: 50%;
    height: 28px;
    color: white;
    font-weight: bold;
    line-height: 48px;
    font-size: 1.2em;
    width: 28px;
    position: relative;
  }

  .circle > div {
    position: absolute;
    text-decoration: none;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .iconPadding {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: silver;
    margin-right: 10px;
  }

  .labelPadding {
    padding-left: calc(1em + 10px + 8px);
  }

  .spectrum-Textfield.spectrum-InputGroup-textfield {
    width: 70%;
  }
  .spectrum-Textfield.spectrum-InputGroup-textfield.is-full-width {
    width: 100%;
  }
  .spectrum-Textfield.spectrum-InputGroup-textfield.is-full-width input {
    border-right-width: thin;
  }

  .spectrum-Popover.spectrum-Popover--bottom.spectrum-Picker-popover.is-open {
    width: 70%;
  }
  .spectrum-Popover.spectrum-Popover--bottom.spectrum-Picker-popover.is-open.is-full-width {
    width: 100%;
  }

  .spectrum-Search-clearButton {
    position: absolute;
  }
</style>
