<script lang="ts" context="module">
  type O = any
  type V = any
</script>

<script lang="ts">
  import "@spectrum-css/menu/dist/index-vars.css"
  import "@spectrum-css/picker/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import { createEventDispatcher, onDestroy, tick } from "svelte"
  import clickOutside from "../../Actions/clickOutside"
  import Icon from "../../Icon/Icon.svelte"
  import Popover from "../../Popover/Popover.svelte"
  import ProgressCircle from "../../ProgressCircle/ProgressCircle.svelte"
  import StatusLight from "../../StatusLight/StatusLight.svelte"
  import Tag from "../../Tags/Tag.svelte"
  import Tags from "../../Tags/Tags.svelte"
  import AbsTooltip from "../../Tooltip/AbsTooltip.svelte"
  import { PopoverAlignment } from "../../constants"
  import Search from "./Search.svelte"
  import PickerIcon from "./PickerIcon.svelte"
  import type { PickerIconInput, ResolvedIcon } from "../../types/Picker"

  export let id: string | undefined = undefined
  export let disabled: boolean = false
  export let fieldText: string = ""
  export let fieldIcon: PickerIconInput = undefined
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
  export let searchPlaceholder: string = "Search"
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
  export let showSelectAll: boolean = false
  export let selectAllText: string = "Select all"
  export let indeterminate: boolean = false
  export let allSelected: boolean = false
  export let toggleSelectAll: () => void = () => {}
  export let hideChevron: boolean = false

  const maxHeight = 360
  const VIRTUALIZATION_THRESHOLD = 200
  const VIRTUALIZATION_OVERSCAN = 6
  const OPTION_HEIGHT = 36

  const dispatch = createEventDispatcher()

  let button: HTMLButtonElement | null = null
  let component: HTMLUListElement | null = null
  let optionIconDescriptor: ResolvedIcon | null = null
  let virtualizedOptions: Array<{ option: O; idx: number }> = []
  let virtualPaddingTop = 0
  let virtualPaddingBottom = 0

  const resolveIcon = (icon: PickerIconInput): ResolvedIcon | null => {
    if (!icon) {
      return null
    }
    if (typeof icon === "object" && icon.component) {
      return {
        type: "component",
        component: icon.component,
        props: icon.props || {},
      }
    }
    if (typeof icon === "string") {
      return { type: "string", value: icon }
    }
    return null
  }

  $: resolvedFieldIcon = resolveIcon(fieldIcon)

  $: sortedOptions = getSortedOptions(options, getOptionLabel, sort)
  $: filteredOptions = getFilteredOptions(
    sortedOptions,
    searchTerm,
    getOptionLabel
  )
  $: virtualizationEnabled = filteredOptions.length > VIRTUALIZATION_THRESHOLD
  $: {
    if (!virtualizationEnabled) {
      virtualizedOptions = filteredOptions.map((option, idx) => ({
        option,
        idx,
      }))
      virtualPaddingTop = 0
      virtualPaddingBottom = 0
    } else {
      tick().then(updateVirtualSlice)
    }
  }
  $: if (virtualizationEnabled && component) {
    tick().then(updateVirtualSlice)
  }

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

  const updateVirtualSlice = () => {
    if (!virtualizationEnabled || !component) {
      return
    }
    const total = filteredOptions.length
    if (!total) {
      virtualizedOptions = []
      virtualPaddingTop = 0
      virtualPaddingBottom = 0
      return
    }
    const scrollTop = component.scrollTop
    const baseStart = Math.floor(scrollTop / OPTION_HEIGHT)
    const startIndex = Math.max(baseStart - VIRTUALIZATION_OVERSCAN, 0)
    const visibleCount =
      Math.ceil(maxHeight / OPTION_HEIGHT) + VIRTUALIZATION_OVERSCAN * 2
    const endIndex = Math.min(startIndex + visibleCount, total)
    virtualPaddingTop = startIndex * OPTION_HEIGHT
    virtualPaddingBottom = Math.max(total - endIndex, 0) * OPTION_HEIGHT
    virtualizedOptions = filteredOptions
      .slice(startIndex, endIndex)
      .map((option, offset) => ({
        option,
        idx: startIndex + offset,
      }))
  }

  const handleScroll = (event: Event) => {
    const target = event.currentTarget as HTMLElement
    onScroll(event)
    if (virtualizationEnabled && target === component) {
      updateVirtualSlice()
    }
  }

  onDestroy(() => {
    component = null
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
  {#if resolvedFieldIcon}
    <span
      class="option-extra icon"
      class:field-icon={useOptionIconImage &&
        resolvedFieldIcon.type !== "component"}
    >
      <PickerIcon icon={resolvedFieldIcon} {useOptionIconImage} />
    </span>
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
  {#if !hideChevron}
    <Icon name="caret-down" size="S" />
  {/if}
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
  {maxHeight}
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
        placeholder={searchPlaceholder}
      />
    {/if}
    <ul
      class="spectrum-Menu"
      role="listbox"
      bind:this={component}
      on:scroll={handleScroll}
    >
      {#if showSelectAll && filteredOptions.length > 0}
        <li
          class="spectrum-Menu-item select-all-item"
          role="option"
          aria-selected="true"
          tabindex="0"
          on:click={toggleSelectAll}
        >
          <span class="spectrum-Menu-itemLabel">{selectAllText}</span>
          {#if indeterminate || allSelected}
            <div class="check select-all-check">
              <Icon
                name={indeterminate ? "minus" : "check"}
                size="S"
                weight="bold"
                color="var(--spectrum-global-color-blue-500)"
              />
            </div>
          {/if}
        </li>
      {/if}
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
        {#if virtualizationEnabled && virtualPaddingTop > 0}
          <li
            class="virtual-spacer"
            aria-hidden="true"
            style={`height:${virtualPaddingTop}px`}
          />
        {/if}
        {#each virtualizedOptions as { option, idx } (getOptionValue(option, idx) ?? idx)}
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
            {#if (optionIconDescriptor = resolveIcon(getOptionIcon(option, idx)))}
              <span class="option-extra icon">
                <PickerIcon icon={optionIconDescriptor} {useOptionIconImage} />
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
        {#if virtualizationEnabled && virtualPaddingBottom > 0}
          <li
            class="virtual-spacer"
            aria-hidden="true"
            style={`height:${virtualPaddingBottom}px`}
          />
        {/if}
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  .select-all-item {
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    margin-bottom: 4px;
  }
  .select-all-item .select-all-check {
    display: block;
  }
  .virtual-spacer {
    list-style: none;
    margin: 0;
    padding: 0;
    pointer-events: none;
  }
</style>
