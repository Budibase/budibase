<script lang="ts" context="module">
  type O = any
</script>

<script lang="ts" generics="O">
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import type { FormEventHandler } from "svelte/elements"
  import clickOutside from "../../Actions/clickOutside"
  import { PopoverAlignment } from "../../constants"
  import Icon from "../../Icon/Icon.svelte"
  import Popover from "../../Popover/Popover.svelte"

  export let value: string | undefined = undefined
  export let id: string | undefined = undefined
  export let placeholder = "Choose an option or type"
  export let disabled = false
  export let readonly = false
  export let options: O[] = []
  export let getOptionLabel = (option: O) => `${option}`
  export let getOptionValue = (option: O) => `${option}`

  const dispatch = createEventDispatcher<{
    change: string
    blur: void
    type: string
    pick: string
  }>()

  let open = false
  let focus = false
  let anchor
  let query = ""
  const normalizeForSearch = (value: unknown): string => {
    if (value === null || value === undefined) {
      return ""
    }
    return String(value).toLowerCase()
  }

  $: query = value || ""
  $: filteredOptions =
    !query.trim() || !options?.length
      ? options
      : options.filter(option => {
          const optionLabel = normalizeForSearch(getOptionLabel(option))
          const optionValue = normalizeForSearch(getOptionValue(option))
          const search = normalizeForSearch(query)
          return optionLabel.includes(search) || optionValue.includes(search)
        })

  const selectOption = (value: string, shouldClose = true) => {
    dispatch("change", value)
    open = !shouldClose
  }

  const onType: FormEventHandler<HTMLInputElement> = e => {
    const value = e.currentTarget.value
    dispatch("type", value)
    selectOption(value, false)
  }

  const onPick = (value: string) => {
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
      on:input={onType}
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
    <Icon name="caret-down" size="S" />
  </button>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<Popover
  {anchor}
  {open}
  align={PopoverAlignment.Left}
  on:close={() => (open = false)}
  useAnchorWidth
>
  <div
    class="popover-content"
    use:clickOutside={() => {
      open = false
    }}
  >
    <ul class="spectrum-Menu" role="listbox">
      {#if filteredOptions && Array.isArray(filteredOptions) && filteredOptions.length}
        {#each filteredOptions as option}
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
            <div class="check">
              <Icon name="check" size="S" />
            </div>
          </li>
        {/each}
      {:else}
        <li class="spectrum-Menu-item empty">No results</li>
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
  .check {
    display: none;
  }

  .empty {
    opacity: 0.7;
    cursor: default;
  }
  li.is-selected .check {
    display: block;
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
