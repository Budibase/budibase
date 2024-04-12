<script>
  import { CoreDatePicker, Icon, Helpers } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let value
  export let schema
  export let onChange
  export let focused = false
  export let readonly = false
  export let api

  let datePickerAPI
  let isOpen

  $: timeOnly = schema?.timeOnly
  $: dateOnly = schema?.dateOnly
  $: editable = focused && !readonly
  $: displayValue = getDisplayValue(value, timeOnly, dateOnly)

  const getDisplayValue = (value, timeOnly, dateOnly) => {
    const parsedDate = Helpers.parseDate(value, { dateOnly })
    return Helpers.getDateDisplayValue(parsedDate, {
      enableTime: !dateOnly,
      timeOnly,
    })
  }

  // Ensure we close flatpickr when unselected
  $: {
    if (!focused) {
      datePickerAPI?.close()
    }
  }

  const onKeyDown = () => {
    return false
  }

  onMount(() => {
    api = {
      onKeyDown,
      focus: () => datePickerAPI?.open(),
      blur: () => datePickerAPI?.close(),
      isActive: () => isOpen,
    }
  })
</script>

<div class="container">
  <div class="value">
    {displayValue}
  </div>
  {#if editable}
    <Icon name="Calendar" />
  {/if}
</div>

{#if editable}
  <div class="picker">
    <CoreDatePicker
      {value}
      on:change={e => onChange(e.detail)}
      enableTime={!dateOnly}
      {timeOnly}
      ignoreTimezones={schema.ignoreTimezones}
      bind:api={datePickerAPI}
      on:open={() => (isOpen = true)}
      on:close={() => (isOpen = false)}
      useKeyboardShortcuts={false}
    />
  </div>
{/if}

<style>
  .container {
    padding: var(--cell-padding);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1 1 auto;
    gap: var(--cell-spacing);
  }
  .value {
    flex: 1 1 auto;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    height: 20px;
  }
  .picker {
    position: absolute;
    opacity: 0;
  }
  .picker :global(.spectrum-Textfield-input) {
    width: 100%;
  }
</style>
