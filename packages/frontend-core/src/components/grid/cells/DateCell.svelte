<script>
  import { CoreDatePickerPopoverContents, Icon, Helpers } from "@budibase/bbui"
  import { onMount } from "svelte"
  import dayjs from "dayjs"
  import GridPopover from "../overlays/GridPopover.svelte"

  export let value
  export let schema
  export let onChange
  export let focused = false
  export let readonly = false
  export let api

  let isOpen
  let anchor

  $: timeOnly = schema?.timeOnly
  $: enableTime = !schema?.dateOnly
  $: ignoreTimezones = schema?.ignoreTimezones
  $: editable = focused && !readonly
  $: parsedValue = Helpers.parseDate(value, {
    timeOnly,
    enableTime,
    ignoreTimezones,
  })
  $: displayValue = getDisplayValue(parsedValue, timeOnly, enableTime)
  // Ensure open state matches desired state
  $: {
    if (!focused && isOpen) {
      close()
    }
  }

  const getDisplayValue = (value, timeOnly, enableTime) => {
    return Helpers.getDateDisplayValue(value, {
      enableTime,
      timeOnly,
    })
  }

  const open = () => {
    isOpen = true
  }

  const close = () => {
    isOpen = false

    // Only save the changed value when closing. If the value is unchanged then
    // this is handled upstream and no action is taken.
    onChange(value)
  }

  const onKeyDown = e => {
    if (!isOpen) {
      return false
    }
    e.preventDefault()
    if (e.key === "ArrowUp") {
      changeDate(-1, "week")
    } else if (e.key === "ArrowDown") {
      changeDate(1, "week")
    } else if (e.key === "ArrowLeft") {
      changeDate(-1, "day")
    } else if (e.key === "ArrowRight") {
      changeDate(1, "day")
    } else if (e.key === "Enter") {
      close()
    }
    return true
  }

  const changeDate = (quantity, unit) => {
    let newValue
    if (!value) {
      newValue = dayjs()
    } else {
      newValue = dayjs(value).add(quantity, unit)
    }
    value = Helpers.stringifyDate(newValue, {
      enableTime,
      timeOnly,
      ignoreTimezones,
    })
  }

  onMount(() => {
    api = {
      onKeyDown,
      focus: open,
      blur: close,
      isActive: () => isOpen,
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="container"
  class:editable
  on:click={editable ? open : null}
  bind:this={anchor}
>
  <div class="value">
    {displayValue}
  </div>
  {#if editable}
    <Icon name="Calendar" />
  {/if}
</div>

{#if isOpen}
  <GridPopover {anchor} maxHeight={null} on:close={close}>
    <CoreDatePickerPopoverContents
      value={parsedValue}
      useKeyboardShortcuts={false}
      on:change={e => (value = e.detail)}
      {enableTime}
      {timeOnly}
      {ignoreTimezones}
    />
  </GridPopover>
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
    user-select: none;
  }
  .container.editable:hover {
    cursor: pointer;
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
</style>
