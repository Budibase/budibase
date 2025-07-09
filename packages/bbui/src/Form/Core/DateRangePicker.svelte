<script lang="ts">
  import dayjs, { type Dayjs } from "dayjs"
  import { createEventDispatcher } from "svelte"
  import CoreDatePicker from "./DatePicker/DatePicker.svelte"
  import Icon from "../../Icon/Icon.svelte"
  import { parseDate } from "../../helpers"
  import { writable } from "svelte/store"

  export let enableTime: boolean | undefined = false
  export let timeOnly: boolean | undefined = false
  export let ignoreTimezones: boolean | undefined = false
  export let value: string[] | undefined = []

  const dispatch = createEventDispatcher()
  const valueStore = writable<string[]>()

  let fromDate: Dayjs | null
  let toDate: Dayjs | null

  $: valueStore.set(value || [])
  $: parseValue($valueStore)

  $: parsedFrom = fromDate ? parseDate(fromDate, { enableTime }) : undefined
  $: parsedTo = toDate ? parseDate(toDate, { enableTime }) : undefined

  const parseValue = (value: string[]) => {
    if (!Array.isArray(value) || !value[0] || !value[1]) {
      fromDate = null
      toDate = null
    } else {
      fromDate = dayjs(value[0])
      toDate = dayjs(value[1])
    }
  }

  const onChangeFrom = (utc: string) => {
    // Preserve the time if its editable
    const fromDate = utc
      ? enableTime
        ? dayjs(utc)
        : dayjs(utc).startOf("day")
      : null
    if (fromDate && (!toDate || fromDate.isAfter(toDate))) {
      toDate = !enableTime ? fromDate.endOf("day") : fromDate
    } else if (!fromDate) {
      toDate = null
    }

    dispatch("change", [fromDate, toDate])
  }

  const onChangeTo = (utc: string) => {
    // Preserve the time if its editable
    const toDate = utc
      ? enableTime
        ? dayjs(utc)
        : dayjs(utc).startOf("day")
      : null
    if (toDate && (!fromDate || toDate.isBefore(fromDate))) {
      fromDate = !enableTime ? toDate.startOf("day") : toDate
    } else if (!toDate) {
      fromDate = null
    }
    dispatch("change", [fromDate, toDate])
  }
</script>

<div class="date-range">
  <CoreDatePicker
    value={parsedFrom}
    on:change={e => onChangeFrom(e.detail)}
    {enableTime}
    {timeOnly}
    {ignoreTimezones}
  />
  <div class="arrow">
    <Icon name="caret-right" />
  </div>
  <CoreDatePicker
    value={parsedTo}
    on:change={e => onChangeTo(e.detail)}
    {enableTime}
    {timeOnly}
    {ignoreTimezones}
  />
</div>

<style>
  .date-range {
    display: flex;
    flex-direction: row;
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: 4px;
  }
  .date-range :global(.spectrum-InputGroup),
  .date-range :global(.spectrum-Textfield),
  .date-range :global(input) {
    min-width: 0 !important;
    width: 150px !important;
  }
  .date-range :global(input) {
    border: none;
    text-align: center;
  }
  .date-range :global(button) {
    display: none;
  }
  .date-range :global(> :first-child input),
  .date-range :global(> :first-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .date-range :global(> :last-child input),
  .date-range :global(> :last-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;
  }
</style>
