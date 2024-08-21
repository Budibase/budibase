<script>
  import { DatePicker } from "@budibase/bbui"
  import dayjs from "dayjs"
  import { createEventDispatcher } from "svelte"
  import { memo } from "@budibase/frontend-core"

  export let value

  const dispatch = createEventDispatcher()
  const valueStore = memo(value)

  let date1
  let date2

  $: valueStore.set(value)
  $: parseValue($valueStore)

  const parseValue = value => {
    if (!Array.isArray(value) || !value[0] || !value[1]) {
      date1 = null
      date2 = null
    } else {
      date1 = value[0]
      date2 = value[1]
    }
  }

  const onChangeDate1 = e => {
    date1 = e.detail ? dayjs(e.detail).startOf("day") : null
    if (date1 && (!date2 || date1.isAfter(date2))) {
      date2 = date1.endOf("day")
    } else if (!date1) {
      date2 = null
    }
    broadcastChange()
  }

  const onChangeDate2 = e => {
    date2 = e.detail ? dayjs(e.detail).endOf("day") : null
    if (date2 && (!date1 || date2.isBefore(date1))) {
      date1 = date2.startOf("day")
    } else if (!date2) {
      date1 = null
    }
    broadcastChange()
  }

  const broadcastChange = () => {
    dispatch("change", [date1, date2])
  }
</script>

<div class="date-range-picker">
  <DatePicker
    value={date1}
    label="Date range"
    enableTime={false}
    on:change={onChangeDate1}
  />
  <DatePicker value={date2} enableTime={false} on:change={onChangeDate2} />
</div>

<style>
  .date-range-picker {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }

  /* Overlap date pickers to remove double border, but put the focused one on top */
  .date-range-picker :global(.spectrum-InputGroup.is-focused) {
    z-index: 1;
  }
  .date-range-picker :global(> :last-child) {
    margin-left: -1px;
  }

  /* Remove border radius at the join */
  .date-range-picker :global(> :first-child .spectrum-InputGroup),
  .date-range-picker :global(> :first-child .spectrum-Picker) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .date-range-picker :global(> :last-child .spectrum-InputGroup),
  .date-range-picker :global(> :last-child .spectrum-Textfield-input) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
