<script>
  import { cleanInput } from "./utils"
  import dayjs from "dayjs"
  import NumberInput from "./NumberInput.svelte"

  export let value
  export let onChange

  const now = dayjs()

  $: displayValue = value || now

  const handleHourChange = e => {
    onChange(displayValue.hour(parseInt(e.target.value)))
  }

  const handleMinuteChange = e => {
    onChange(displayValue.minute(parseInt(e.target.value)))
  }

  const cleanHour = cleanInput({ max: 23, pad: 2, fallback: "00" })
  const cleanMinute = cleanInput({ max: 59, pad: 2, fallback: "00" })
</script>

<div class="time-picker">
  <NumberInput
    hideArrows
    value={displayValue.hour().toString().padStart(2, "0")}
    min={0}
    max={23}
    width={20}
    on:input={cleanHour}
    on:change={handleHourChange}
  />
  <span>:</span>
  <NumberInput
    hideArrows
    value={displayValue.minute().toString().padStart(2, "0")}
    min={0}
    max={59}
    width={20}
    on:input={cleanMinute}
    on:change={handleMinuteChange}
  />
</div>

<style>
  .time-picker {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .time-picker span {
    font-weight: bold;
    font-size: 18px;
    z-index: -1;
    margin-bottom: 1px;
  }
</style>
