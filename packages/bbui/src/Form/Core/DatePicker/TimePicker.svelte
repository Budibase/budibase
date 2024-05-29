<script>
  import dayjs from "dayjs"
  import NumberInput from "./NumberInput.svelte"
  import { createEventDispatcher } from "svelte"

  export let value

  const dispatch = createEventDispatcher()

  $: displayValue = value?.format("HH:mm")

  const handleChange = e => {
    if (!e.target.value) {
      dispatch("change", undefined)
      return
    }

    const [hour, minute] = e.target.value.split(":").map(x => parseInt(x))
    dispatch("change", (value || dayjs()).hour(hour).minute(minute))
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
