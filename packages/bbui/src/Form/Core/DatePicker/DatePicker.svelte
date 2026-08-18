<script lang="ts" module>
  export interface DatePickerApi {
    open: () => void
    close: () => void
  }
</script>

<script lang="ts" generics="V">
  import "@spectrum-css/calendar/dist/index-vars.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/textfield/dist/index-vars.css"
  import Popover from "../../../Popover/Popover.svelte"
  import { onMount } from "svelte"
  import DateInput from "./DateInput.svelte"
  import { parseDate } from "../../../helpers"
  import DatePickerPopoverContents from "./DatePickerPopoverContents.svelte"
  import { PopoverAlignment } from "../../../constants"
  import type dayjs from "dayjs"
  import { getLocaleStartDayOfWeek, type Weekday } from "./utils"
  import { resolveTranslationGroup } from "@budibase/shared-core"

  export let id: string | null = null
  export let disabled = false
  export let readonly = false
  export let error: string | false | null | undefined = null
  export let enableTime = true
  export let value: V | null = null
  export let placeholder: string | null = null
  export let timeOnly = false
  export let setTimeTo: string | undefined = undefined
  export let ignoreTimezones = false
  export let useKeyboardShortcuts = true
  export let appendTo: string | undefined = undefined
  export let api: DatePickerApi | null = null
  export let align: PopoverAlignment = PopoverAlignment.Left
  const browserStartDayOfWeek = getLocaleStartDayOfWeek()
  export let startDayOfWeek: Weekday | undefined = undefined
  export let calendarLabels = resolveTranslationGroup("calendar")

  let isOpen = false
  let anchor: HTMLElement
  let popover: Popover

  $: resolvedStartDayOfWeek = startDayOfWeek ?? browserStartDayOfWeek

  $: parsedValue = parseDate(value as string | dayjs.Dayjs | null, {
    enableTime,
    setTimeTo,
  })

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
  icon={timeOnly ? "clock" : "calendar"}
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
  widthMode={timeOnly ? "fixed-to-anchor" : "no-anchor"}
  resizable={false}
>
  {#if isOpen}
    <DatePickerPopoverContents
      {useKeyboardShortcuts}
      {ignoreTimezones}
      {enableTime}
      {timeOnly}
      {setTimeTo}
      startDayOfWeek={resolvedStartDayOfWeek}
      {calendarLabels}
      value={parsedValue}
      on:change
    />
  {/if}
</Popover>
