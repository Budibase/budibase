<script lang="ts" context="module">
  type O = any
  type V = any
</script>

<script lang="ts">
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
  import AbsTooltip from "../../Tooltip/AbsTooltip.svelte"
  import { PopoverAlignment } from "../../constants"

  export let id: string | undefined = undefined
  export let disabled: boolean = false
  export let fieldText: string = ""
  export let fieldIcon: string = ""
  export let fieldColour: string = ""
  export let isPlaceholder: boolean = false
  export let placeholderOption: string | undefined | boolean = undefined
  export let options: O[] = []
  export let isOptionSelected = (option: O) => option as unknown as boolean
  export let isOptionEnabled = (option: O, _index?: number) =>
    option as unknown as boolean
  export let tooltipMessage:
    | ((_option: O, _index?: number) => string)
    | undefined = undefined
  export let onSelectOption: (_value: V) => void = () => {}
  export let getOptionLabel = (option: O, _index?: number) => `${option}`
  export let getOptionValue = (option: O, _index?: number) =>
    option as unknown as V
  export let getOptionIcon = (option: O, _index?: number) =>
    option?.icon ?? undefined
  export let getOptionColour = (option: O, _index?: number) =>
    option?.colour ?? undefined
  export let getOptionSubtitle = (option: O, _index?: number) =>
    option?.subtitle ?? undefined
  export let useOptionIconImage = false
  export let open: boolean = false
  export let readonly: boolean = false
  export let quiet: boolean = false
  export let autoWidth: boolean | undefined = false
  export let autocomplete: boolean = false
  export let sort: boolean = false
  export let searchTerm: string | null = null
  export let customPopoverHeight: string | undefined = undefined
  export let align: PopoverAlignment | undefined = PopoverAlignment.Left
  export let footer: string | undefined = undefined
  export let customAnchor: HTMLElement | undefined = undefined
  export let loading: boolean = false
  export let onOptionMouseenter: (
    _e: MouseEvent,
    _option: any
  ) => void = () => {}
  export let onOptionMouseleave: (
    _e: MouseEvent,
    _option: any
  ) => void = () => {}

  const dispatch = createEventDispatcher()

  let button: any
  let component: any

  $: sortedOptions = getSortedOptions(options, getOptionLabel, sort)
  $: filteredOptions = getFilteredOptions(
    sortedOptions,
    searchTerm,
    getOptionLabel
  )

  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch("click")
    if (readonly) {
      return
    }
    searchTerm = null
    open = !open
  }

  const getSortedOptions = (
    options: any[],
    getLabel: (_option: any) => string,
    sort: boolean
  ) => {
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

  const getFilteredOptions = (
    options: any[],
    term: string | null,
    getLabel: (_option: any) => string
  ) => {
    if (autocomplete && term) {
      const lowerCaseTerm = term.toLowerCase()
      return options.filter((option: any) => {
        return `${getLabel(option)}`.toLowerCase().includes(lowerCaseTerm)
      })
    }
    return options
  }

  const onScroll = (e: any) => {
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
  class:is-open={open}
  aria-haspopup="listbox"
  on:click={onClick}
  bind:this={button}
>
  {#if fieldIcon}
    {#if !useOptionIconImage}
      <span class="option-extra icon">
        <Icon size="M" name={fieldIcon} />
      </span>
    {:else}
      <span class="option-extra icon field-icon">
        <img src={fieldIcon} alt="icon" style="height: 15px; width: auto;" />
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
  <Icon name="caret-down" size="S" />
</button>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<Popover
  anchor={customAnchor ? customAnchor : button}
  align={align || PopoverAlignment.Left}
  {open}
  on:close={() => (open = false)}
  useAnchorWidth={!autoWidth}
  maxWidth={autoWidth ? 400 : undefined}
  customHeight={customPopoverHeight}
  maxHeight={360}
>
  <div
    class="popover-content"
    class:auto-width={autoWidth}
    use:clickOutside={() => {
      open = false
    }}
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
          <div class="check">
            <Icon
              name="check"
              size="S"
              weight="bold"
              color="var(--spectrum-global-color-blue-500)"
            />
          </div>
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
            on:mouseenter={e => onOptionMouseenter(e, option)}
            on:mouseleave={e => onOptionMouseleave(e, option)}
            class:is-disabled={!isOptionEnabled(option)}
          >
            {#if getOptionIcon(option, idx)}
              <span class="option-extra icon">
                {#if useOptionIconImage}
                  <img
                    src={getOptionIcon(option, idx)}
                    alt="icon"
                    style="height: 15px; width: auto;"
                  />
                {:else}
                  <Icon
                    size="M"
                    color="var(--spectrum-global-color-gray-600)"
                    name={getOptionIcon(option, idx)}
                  />
                {/if}
              </span>
            {/if}
            {#if getOptionColour(option, idx)}
              <span class="option-extra">
                <StatusLight square color={getOptionColour(option, idx)} />
              </span>
            {/if}
            <span class="spectrum-Menu-itemLabel">
              {getOptionLabel(option, idx)}
              {#if getOptionSubtitle(option, idx)}
                <span class="subtitle-text">
                  {getOptionSubtitle(option, idx)}
                </span>
              {/if}
            </span>
            {#if option.tag}
              <span class="option-tag">
                <Tags>
                  <Tag icon="lock">{option.tag}</Tag>
                </Tags>
              </span>
            {/if}
            {#if tooltipMessage && tooltipMessage(option).length > 0}
              <AbsTooltip text={tooltipMessage(option)}>
                <Icon size="XS" name="info" />
              </AbsTooltip>
            {/if}
            <div class="check">
              <Icon
                name="check"
                size="S"
                weight="bold"
                color="var(--spectrum-global-color-blue-500)"
              />
            </div>
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
  .check {
    display: none;
    padding-left: 8px;
  }
  li.is-selected .check {
    display: block;
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
    overflow: hidden;
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
  .option-tag :global(.spectrum-Tags-item > i) {
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

  .subtitle-text {
    font-size: 12px;
    line-height: 15px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-600);
    display: block;
    margin-top: var(--spacing-s);
  }
</style>
