<script>
  import "@spectrum-css/calendar/dist/index-vars.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/textfield/dist/index-vars.css"
  import Popover from "../../../Popover/Popover.svelte"
  import { onMount } from "svelte"
  import DateInput from "./DateInput.svelte"
  import { parseDate } from "../../../helpers"
  import DatePickerPopoverContents from "./DatePickerPopoverContents.svelte"

  export let id = null
  export let disabled = false
  export let readonly = false
  export let error = null
  export let enableTime = true
  export let value = null
  export let placeholder = null
  export let timeOnly = false
  export let ignoreTimezones = false
  export let useKeyboardShortcuts = true
  export let appendTo = null
  export let api = null
  export let align = "left"

  let isOpen = false
  let anchor
  let popover

  $: parsedValue = parseDate(value, { timeOnly, enableTime })

  const onOpen = () => {
    isOpen = true
  }

  const onClose = () => {
    isOpen = false
  }

  onMount(() => {
    api = {
      open: () => popover?.show(),
      close: () => popover?.hide(),
    }
  })
</script>

<DateInput
  bind:anchor
  {disabled}
  {readonly}
  {error}
  {placeholder}
  {id}
  {enableTime}
  {timeOnly}
  focused={isOpen}
  value={parsedValue}
  on:click={popover?.show}
  icon={timeOnly ? "Clock" : "Calendar"}
/>

<Popover
  bind:this={popover}
  on:open
  on:close
  on:open={onOpen}
  on:close={onClose}
  portalTarget={appendTo}
  {anchor}
  {align}
  resizable={false}
>
  {#if isOpen}
    <DatePickerPopoverContents
      {useKeyboardShortcuts}
      {ignoreTimezones}
      {enableTime}
      {timeOnly}
      value={parsedValue}
      on:change
    />
  {/if}
</Popover>
