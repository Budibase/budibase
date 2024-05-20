<script>
  import NumberInput from "./NumberInput.svelte"
  import { createEventDispatcher } from "svelte"

  export let value

  const dispatch = createEventDispatcher()

  $: displayValue = value?.format("HH:mm")

  const handleChange = e => {
    const [hour, minute] = e.target.value.split(":").map(x => parseInt(x))
    dispatch("change", value.hour(hour).minute(minute))
  }
</script>

<div class="time-picker">
  <NumberInput
    hideArrows
    type={"time"}
    value={displayValue}
    width={60}
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
