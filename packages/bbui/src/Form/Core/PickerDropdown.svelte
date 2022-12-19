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
  import Search from "./Search.svelte"
  import IconAvatar from "../../Icon/IconAvatar.svelte"

  export let primaryLabel = ""
  export let primaryValue = null
  export let id = null
  export let placeholder = "Choose an option or type"
  export let disabled = false
  export let error = null
  export let secondaryOptions = []
  export let primaryOptions = []
  export let secondaryFieldText = ""
  export let secondaryFieldIcon = ""
  export let secondaryFieldColour = ""
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
  export let showClearIcon = true

  const dispatch = createEventDispatcher()
  let primaryOpen = false
  let secondaryOpen = false
  let focus = false
  let searchTerm = null

  $: groupTitles = Object.keys(primaryOptions)
  let iconData

  const updateSearch = e => {
    dispatch("search", e.detail)
  }

  const updateValue = newValue => {
    dispatch("change", newValue)
  }

  const onClickSecondary = () => {
    dispatch("click")
    secondaryOpen = true
  }

  const onPickPrimary = newValue => {
    dispatch("pickprimary", newValue)
    primaryOpen = false
    dispatch("closed")
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
    focus = false
    updateValue(event.target.value)
  }

  const onInput = event => {
    updateValue(event.target.value)
  }

  const updateValueOnEnter = event => {
    if (event.key === "Enter") {
      updateValue(event.target.value)
    }
  }

  const handlePrimaryOutsideClick = event => {
    if (primaryOpen) {
      event.stopPropagation()
      primaryOpen = false
      dispatch("closed")
    }
  }

  const handleSecondaryOutsideClick = event => {
    if (secondaryOpen) {
      event.stopPropagation()
      secondaryOpen = false
    }
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
      readonly
      class="spectrum-Textfield-input spectrum-InputGroup-input"
      class:labelPadding={iconData}
      class:open={primaryOpen}
    />
    {#if primaryValue && showClearIcon}
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
      use:clickOutside={handlePrimaryOutsideClick}
      transition:fly|local={{ y: -20, duration: 200 }}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
      class:auto-width={autoWidth}
      class:is-full-width={!secondaryOptions.length}
    >
      {#if autocomplete}
        <Search
          value={searchTerm}
          on:change={event => updateSearch(event)}
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
        {#each groupTitles as title}
          <div class="spectrum-Menu-item title">
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
                  <IconAvatar
                    size="S"
                    icon={primaryOptions[title].getIcon(option)}
                    background={primaryOptions[title].getColour(option)}
                  />
                {:else if getPrimaryOptionColour(option, idx)}
                  <span class="option-left">
                    <StatusLight
                      square
                      color={getPrimaryOptionColour(option, idx)}
                    />
                  </span>
                {/if}
                <span class="spectrum-Menu-itemLabel">
                  <div
                    class="primary-text"
                    class:spacing-group={primaryOptions[title].getIcon(option)}
                  >
                    {primaryOptions[title].getLabel(option)}
                    <span />
                  </div>
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
                        square
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
        on:click={onClickSecondary}
      >
        {#if secondaryFieldIcon}
          <span class="option-left">
            <Icon name={secondaryFieldIcon} />
          </span>
        {:else if secondaryFieldColour}
          <span class="option-left">
            <StatusLight square color={secondaryFieldColour} />
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
          use:clickOutside={handleSecondaryOutsideClick}
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
                      square
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
  .primary-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .spacing-group {
    margin-left: var(--spacing-m);
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

  /* Fix focus borders to show only when opened */
  .spectrum-Textfield-input {
    border-color: var(--spectrum-global-color-gray-400) !important;
    border-right-width: 1px;
  }
  .spectrum-Textfield-input.open {
    border-color: var(--spectrum-global-color-blue-400) !important;
  }

  /* Fix being able to hover and select titles */
  .spectrum-Menu-item.title {
    pointer-events: none;
  }
</style>
