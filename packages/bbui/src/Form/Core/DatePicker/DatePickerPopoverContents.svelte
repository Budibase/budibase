<script lang="ts">
  import dayjs from "dayjs"
  import TimePicker from "./TimePicker.svelte"
  import Calendar from "./Calendar.svelte"
  import ActionButton from "../../../ActionButton/ActionButton.svelte"
  import { createEventDispatcher, onMount } from "svelte"
  import { stringifyDate } from "../../../helpers"
  import { resolveTranslationGroup } from "@budibase/shared-core"
  import type { Dayjs } from "dayjs"
  import type { Weekday } from "./utils"

  export let useKeyboardShortcuts: boolean = true
  export let ignoreTimezones: boolean = false
  export let enableTime: boolean = true
  export let timeOnly: boolean = false
  export let value: Dayjs | null | undefined = undefined
  export let startDayOfWeek: Weekday = "Monday"
  export let calendarLabels = resolveTranslationGroup("calendar")

  const dispatch = createEventDispatcher<{ change: string | null }>()
  let calendar: { setDate: (date: Dayjs) => void } | undefined

  $: showCalendar = !timeOnly
  $: showTime = enableTime || timeOnly

  const setToNow = () => {
    const now = dayjs().second(0).millisecond(0)
    calendar?.setDate(now)
    handleChange(now)
  }

  const handleChange = (date: Dayjs | null) => {
    dispatch(
      "change",
      stringifyDate(date, { enableTime, timeOnly, ignoreTimezones })
    )
  }

  const clearDateOnBackspace = (event: KeyboardEvent) => {
    // Ignore if we're typing a value
    if (document.activeElement?.tagName.toLowerCase() === "input") {
      return
    }
    if (["Backspace", "Clear", "Delete"].includes(event.key)) {
      dispatch("change", null)
    }
  }

  onMount(() => {
    if (useKeyboardShortcuts) {
      document.addEventListener("keyup", clearDateOnBackspace)
    }
    return () => {
      document.removeEventListener("keyup", clearDateOnBackspace)
    }
  })
</script>

<div class="date-time-popover">
  {#if showCalendar}
    <Calendar
      {value}
      {startDayOfWeek}
      {calendarLabels}
      on:change={e => handleChange(e.detail)}
      bind:this={calendar}
    />
  {/if}
  <div class="footer" class:spaced={showCalendar}>
    {#if showTime}
      <TimePicker {value} on:change={e => handleChange(e.detail)} />
    {/if}
    <div class="actions">
      <ActionButton
        disabled={!value}
        size="S"
        on:click={() => dispatch("change", null)}
      >
        {calendarLabels?.datePickerClear || "Clear"}
      </ActionButton>
      <ActionButton size="S" on:click={setToNow}>
        {showTime
          ? calendarLabels?.datePickerNow || "Now"
          : calendarLabels?.todayButton || "Today"}
      </ActionButton>
    </div>
  </div>
</div>

<style>
  .date-time-popover {
    padding: 8px;
    overflow: hidden;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
  }
  .footer.spaced {
    padding-top: 14px;
  }
  .actions {
    padding: 4px 0;
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }
</style>
