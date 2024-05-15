<script>
  import dayjs from "dayjs"
  import TimePicker from "./TimePicker.svelte"
  import Calendar from "./Calendar.svelte"
  import ActionButton from "../../../ActionButton/ActionButton.svelte"
  import { createEventDispatcher, onMount } from "svelte"
  import { stringifyDate } from "../../../helpers"

  export let useKeyboardShortcuts = true
  export let ignoreTimezones
  export let enableTime
  export let timeOnly
  export let value

  const dispatch = createEventDispatcher()
  let calendar

  $: showCalendar = !timeOnly
  $: showTime = enableTime || timeOnly

  const setToNow = () => {
    const now = dayjs()
    calendar?.setDate(now)
    handleChange(now)
  }

  const handleChange = date => {
    dispatch(
      "change",
      stringifyDate(date, { enableTime, timeOnly, ignoreTimezones })
    )
  }

  const clearDateOnBackspace = event => {
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
        Clear
      </ActionButton>
      <ActionButton size="S" on:click={setToNow}>
        {showTime ? "Now" : "Today"}
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
