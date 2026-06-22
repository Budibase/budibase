<script>
  import dayjs from "dayjs"
  import NumberInput from "./NumberInput.svelte"
  import { parseTimeInput, isPartialTimeInput } from "../../../helpers"
  import { createEventDispatcher } from "svelte"

  export let value
  export let time24hr = true

  const dispatch = createEventDispatcher()

  $: format = time24hr ? "HH:mm" : "hh:mm A"
  $: displayValue = value?.format(format)
  // Tracks the last accepted text. Resyncs whenever the value changes
  // externally (e.g. picking a date), but is left untouched while typing since
  // displayValue only changes on commit.
  $: lastValid = displayValue ?? ""

  // Reject any keystroke that couldn't form a real time, so the field can never
  // hold arbitrary or out-of-range text like "687:09090", "99:99" or "nope".
  const handleInput = e => {
    const input = e.target
    if (isPartialTimeInput(input.value, time24hr)) {
      lastValid = input.value
    } else {
      input.value = lastValid
      input.setSelectionRange(lastValid.length, lastValid.length)
    }
  }

  const handleChange = e => {
    const raw = e.target.value
    if (!raw.trim()) {
      dispatch("change", undefined)
      return
    }

    const parsed = parseTimeInput(raw)
    if (!parsed) {
      // Reject invalid times by restoring the last valid value, so the field
      // only ever holds a properly formatted time
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
    // Normalise the displayed text to the chosen format
    e.target.value = parsed.format(format)
  }
</script>

<div class="time-picker">
  <NumberInput
    hideArrows
    type="text"
    value={displayValue}
    on:input={handleInput}
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
