<script>
  import "@spectrum-css/picker/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { createEventDispatcher, onDestroy } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Search from "./Search.svelte"
  import Icon from "../../Icon/Icon.svelte"
  import StatusLight from "../../StatusLight/StatusLight.svelte"
  import Popover from "../../Popover/Popover.svelte"
  import Tags from "../../Tags/Tags.svelte"
  import Tag from "../../Tags/Tag.svelte"
  import ProgressCircle from "../../ProgressCircle/ProgressCircle.svelte"

  export let id = null
  export let disabled = false
  export let error = null
  export let fieldText = ""
  export let fieldIcon = ""
  export let fieldColour = ""
  export let isPlaceholder = false
  export let placeholderOption = null
  export let options = []
  export let isOptionSelected = () => false
  export let isOptionEnabled = () => true
  export let onSelectOption = () => {}
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let getOptionIcon = () => null
  export let useOptionIconImage = false
  export let getOptionColour = () => null
  export let getOptionSubtitle = () => null
  export let open = false
  export let readonly = false
  export let quiet = false
  export let autoWidth = false
  export let autocomplete = false
  export let sort = false
  export let searchTerm = null
  export let customPopoverHeight
  export let customPopoverOffsetBelow
  export let customPopoverMaxHeight
  export let align = "left"
  export let footer = null
  export let customAnchor = null
  export let loading

  const dispatch = createEventDispatcher()

  let button
  let popover
  let component

  $: sortedOptions = getSortedOptions(options, getOptionLabel, sort)
  $: filteredOptions = getFilteredOptions(
    sortedOptions,
    searchTerm,
    getOptionLabel
  )

  const onClick = e => {
    e.preventDefault()
    e.stopPropagation()
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

  const onScroll = e => {
    const scrollPxThreshold = 100
    const scrollPositionFromBottom =
      e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
    if (scrollPositionFromBottom < scrollPxThreshold) {
      dispatch("loadMore")
    }
  }

  $: component?.addEventListener("scroll", onScroll)
  onDestroy(() => {
    component?.removeEventListener("scroll", null)
  })
</script>

<button
  {id}
  class="spectrum-Picker spectrum-Picker--sizeM"
  class:spectrum-Picker--quiet={quiet}
  {disabled}
  class:is-invalid={!!error}
  class:is-open={open}
  aria-haspopup="listbox"
  on:click={onClick}
  bind:this={button}
>
  {#if fieldIcon}
    {#if !useOptionIconImage}
      <span class="option-extra icon">
        <Icon size="S" name={fieldIcon} />
      </span>
    {:else}
      <span class="option-extra icon field-icon">
        <img src={fieldIcon} alt="icon" width="15" height="15" />
      </span>
    {/if}
  {/if}
  {#if fieldColour}
    <span class="option-extra">
      <StatusLight square color={fieldColour} />
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
<Popover
  anchor={customAnchor ? customAnchor : button}
  align={align || "left"}
  bind:this={popover}
  {open}
  on:close={() => (open = false)}
  useAnchorWidth={!autoWidth}
  maxWidth={autoWidth ? 400 : null}
  maxHeight={customPopoverMaxHeight}
  customHeight={customPopoverHeight}
  offsetBelow={customPopoverOffsetBelow}
>
  <div
    class="popover-content"
    class:auto-width={autoWidth}
    use:clickOutside={() => (open = false)}
  >
    {#if autocomplete}
      <Search
        value={searchTerm}
        on:change={event => (searchTerm = event.detail)}
        {disabled}
        placeholder="Search"
      />
    {/if}
    <ul class="spectrum-Menu" role="listbox" bind:this={component}>
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
            class:is-disabled={!isOptionEnabled(option)}
          >
            {#if getOptionIcon(option, idx)}
              <span class="option-extra icon">
                {#if useOptionIconImage}
                  <img
                    src={getOptionIcon(option, idx)}
                    alt="icon"
                    width="15"
                    height="15"
                  />
                {:else}
                  <Icon size="S" name={getOptionIcon(option, idx)} />
                {/if}
              </span>
            {/if}
            {#if getOptionColour(option, idx)}
              <span class="option-extra">
                <StatusLight square color={getOptionColour(option, idx)} />
              </span>
            {/if}
            <span class="spectrum-Menu-itemLabel">
              {#if getOptionSubtitle(option, idx)}
                <span class="subtitle-text"
                  >{getOptionSubtitle(option, idx)}</span
                >
              {/if}

              {getOptionLabel(option, idx)}
            </span>
            {#if option.tag}
              <span class="option-tag">
                <Tags>
                  <Tag icon="LockClosed">{option.tag}</Tag>
                </Tags>
              </span>
            {/if}
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

    {#if loading}
      <div class="loading" class:loading--withAutocomplete={autocomplete}>
        <ProgressCircle size="S" />
      </div>
    {/if}

    {#if footer}
      <div class="footer">
        {footer}
      </div>
    {/if}
  </div>
</Popover>

<style>
  .spectrum-Picker {
    width: 100%;
    box-shadow: none;
  }

  .subtitle-text {
    font-size: 12px;
    line-height: 15px;
    font-weight: 500;
    top: 10px;
    color: var(--spectrum-global-color-gray-600);
    display: block;
    margin-bottom: var(--spacing-s);
  }

  .spectrum-Picker-label.auto-width {
    margin-right: var(--spacing-xs);
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

  /* Icon and colour alignment */
  .spectrum-Menu-checkmark {
    align-self: center;
    margin-top: 0;
  }
  .option-extra {
    padding-right: 8px;
  }
  .option-extra.icon {
    margin: 0 -1px;
  }

  /* Popover */
  .popover-content {
    display: contents;
  }
  .popover-content.auto-width .spectrum-Menu-itemLabel {
    white-space: nowrap;
    overflow: none;
    text-overflow: ellipsis;
  }
  .popover-content:not(.auto-width) .spectrum-Menu-itemLabel {
    width: 0;
    flex: 1 1 auto;
  }
  .popover-content.auto-width .spectrum-Menu-item {
    padding-right: var(--spacing-xl);
  }
  .spectrum-Menu-item.is-disabled {
    pointer-events: none;
  }

  /* Search styles inside popover */
  .popover-content :global(.spectrum-Search) {
    margin-top: -1px;
    width: 100%;
  }
  .popover-content :global(.spectrum-Search input) {
    height: auto;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-left: 0;
    border-right: 0;
    padding-top: var(--spectrum-global-dimension-size-100);
    padding-bottom: var(--spectrum-global-dimension-size-100);
  }
  .popover-content :global(.spectrum-Search .spectrum-ClearButton) {
    right: 2px;
    top: 2px;
  }
  .popover-content :global(.spectrum-Search .spectrum-Textfield-icon) {
    top: 9px;
  }

  .footer {
    padding: 4px 12px 12px 12px;
    font-style: italic;
    max-width: 170px;
    font-size: 12px;
  }

  .option-extra.icon.field-icon {
    display: flex;
  }

  .option-tag {
    margin: 0 var(--spacing-m) 0 var(--spacing-m);
  }

  .option-tag :global(.spectrum-Tags-item > .spectrum-Icon) {
    margin-top: 2px;
  }

  .loading {
    position: fixed;
    justify-content: center;
    right: var(--spacing-s);
    top: var(--spacing-s);
  }
  .loading--withAutocomplete {
    top: calc(34px + var(--spacing-m));
  }
</style>
