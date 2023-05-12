<script>
  import dayjs from "dayjs"
  import { CoreDatePicker, Icon } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let value
  export let schema
  export let onChange
  export let focused = false
  export let readonly = false
  export let api

  let flatpickr
  let isOpen

  // adding the 0- will turn a string like 00:00:00 into a valid ISO
  // date, but will make actual ISO dates invalid
  $: time = new Date(`0-${value}`)
  $: timeOnly = !isNaN(time) || schema?.timeOnly
  $: dateOnly = schema?.dateOnly
  $: format = timeOnly
    ? "HH:mm:ss"
    : dateOnly
    ? "MMM D YYYY"
    : "MMM D YYYY, HH:mm"
  $: editable = focused && !readonly

  // Ensure we close flatpickr when unselected
  $: {
    if (!focused) {
      flatpickr?.close()
    }
  }

  const onKeyDown = () => {
    return isOpen
  }

  onMount(() => {
    api = {
      onKeyDown,
      focus: () => flatpickr?.open(),
      blur: () => flatpickr?.close(),
      isActive: () => isOpen,
    }
  })
</script>

<div class="container">
  <div class="value">
    {#if value}
      {dayjs(timeOnly ? time : value).format(format)}
    {/if}
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
      appendTo={document.documentElement}
      enableTime={!dateOnly}
      {timeOnly}
      time24hr
      ignoreTimezones={schema.ignoreTimezones}
      bind:flatpickr
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
  }
  .picker {
    position: absolute;
    opacity: 0;
  }
  .picker :global(.flatpickr) {
    min-width: 0;
  }
  .picker :global(.spectrum-Textfield-input) {
    width: 100%;
  }
</style>
