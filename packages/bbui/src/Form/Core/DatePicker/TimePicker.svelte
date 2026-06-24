<script lang="ts">
  import type { Dayjs } from "dayjs"
  import dayjs from "dayjs"
  import NumberInput from "./NumberInput.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: Dayjs | undefined
  export let disableClearing = false

  const dispatch = createEventDispatcher<{ change: Dayjs | undefined }>()

  $: displayValue = value?.format("HH:mm")

  const handleChange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    if (!target.value) {
      if (disableClearing) {
        target.value = displayValue || "00:00"
        return
      }
      dispatch("change", undefined)
      return
    }

    const [hour, minute] = target.value.split(":").map(x => parseInt(x))
    dispatch(
      "change",
      (value || dayjs()).hour(hour).minute(minute).second(0).millisecond(0)
    )
  }
</script>

<div class="time-picker">
  <NumberInput
    hideArrows
    type={"time"}
    value={displayValue}
    on:input={handleChange}
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
