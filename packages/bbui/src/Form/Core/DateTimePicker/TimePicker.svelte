<script>
  import { cleanInput } from "./utils"
  import dayjs from "dayjs"

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
  <input
    type="number"
    value={displayValue.hour().toString().padStart(2, "0")}
    min="0"
    max="23"
    onclick="this.select()"
    on:input={cleanHour}
    on:change={handleHourChange}
  />
  <span>:</span>
  <input
    type="number"
    value={displayValue.minute().toString().padStart(2, "0")}
    min="0"
    max="59"
    onclick="this.select()"
    on:input={cleanMinute}
    on:change={handleMinuteChange}
  />
</div>

<style>
  .time-picker {
    padding: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .time-picker span {
    font-weight: bold;
    font-size: 18px;
    z-index: -1;
    color: var(--spectrum-global-color-gray-700);
  }
  .time-picker input:first-child {
    margin-right: -16px;
  }
  .time-picker input:last-child {
    margin-left: 8px;
  }
</style>
