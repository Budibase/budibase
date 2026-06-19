<script>
  import dayjs from "dayjs"
  import customParseFormat from "dayjs/plugin/customParseFormat"
  import NumberInput from "./NumberInput.svelte"
  import { createEventDispatcher } from "svelte"

  dayjs.extend(customParseFormat)

  // Accepted input formats, regardless of the display format chosen
  const inputFormats = ["HH:mm", "H:mm", "hh:mm A", "h:mm A"]

  export let value
  export let time24hr = true

  const dispatch = createEventDispatcher()

  $: format = time24hr ? "HH:mm" : "hh:mm A"
  $: displayValue = value?.format(format)

  const handleChange = e => {
    const raw = e.target.value
    if (!raw) {
      dispatch("change", undefined)
      return
    }

    const parsed = dayjs(raw, inputFormats)
    if (!parsed.isValid()) {
      // Restore the last valid value so we never leave invalid text behind
      e.target.value = displayValue ?? ""
      return
    }
    dispatch(
      "change",
      (value || dayjs())
        .hour(parsed.hour())
        .minute(parsed.minute())
        .second(0)
        .millisecond(0)
    )
  }
</script>

<div class="time-picker">
  <NumberInput
    hideArrows
    type="text"
    value={displayValue}
    on:change={handleChange}
  />
</div>

<style>
  .time-picker {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
