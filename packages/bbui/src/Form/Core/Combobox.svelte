<script lang="ts" context="module">
  type O = any
</script>

<script lang="ts" generics="O">
  import type { ChangeEventHandler } from "svelte/elements"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Popover from "../../Popover/Popover.svelte"
  import { PopoverAlignment } from "../../constants"
  import Icon from "../../Icon/Icon.svelte"

  export let value: string | undefined = undefined
  export let id: string | undefined = undefined
  export let placeholder = "Choose an option or type"
  export let disabled = false
  export let readonly = false
  export let options: O[] = []
  export let getOptionLabel = (option: O) => `${option}`
  export let getOptionValue = (option: O) => `${option}`

  const dispatch = createEventDispatcher<{
    change: string
    blur: void
    type: string
    pick: string
  }>()

  let open = false
  let focus = false
  let anchor

  const selectOption = (value: string) => {
    dispatch("change", value)
    open = false
  }

  const onType: ChangeEventHandler<HTMLInputElement> = e => {
    const value = e.currentTarget.value
    dispatch("type", value)
    selectOption(value)
  }

  const onPick = (value: string) => {
    dispatch("pick", value)
    selectOption(value)
  }
</script>

<div
  class="spectrum-InputGroup"
  class:is-focused={open || focus}
  class:is-disabled={disabled}
  bind:this={anchor}
>
  <div
    class="spectrum-Textfield spectrum-InputGroup-textfield"
    class:is-disabled={disabled}
    class:is-focused={open || focus}
  >
    <input
      {id}
      type="text"
      on:focus={() => (focus = true)}
      on:blur={() => {
        focus = false
        dispatch("blur")
      }}
      on:change={onType}
      value={value || ""}
      placeholder={placeholder || ""}
      {disabled}
      {readonly}
      class="spectrum-Textfield-input spectrum-InputGroup-input"
    />
  </div>
  <button
    class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
    tabindex="-1"
    aria-haspopup="true"
    {disabled}
    on:click={() => (open = !open)}
  >
    <Icon name="caret-down" size="S" />
  </button>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<Popover
  {anchor}
  {open}
  align={PopoverAlignment.Left}
  on:close={() => (open = false)}
  useAnchorWidth
>
  <div
    class="popover-content"
    use:clickOutside={() => {
      open = false
    }}
  >
    <ul class="spectrum-Menu" role="listbox">
      {#if options && Array.isArray(options)}
        {#each options as option}
          <li
            class="spectrum-Menu-item"
            class:is-selected={getOptionValue(option) === value}
            role="option"
            aria-selected="true"
            tabindex="0"
            on:click={() => onPick(getOptionValue(option))}
          >
            <span class="spectrum-Menu-itemLabel">{getOptionLabel(option)}</span
            >
            <div class="check">
              <Icon name="check" size="S" />
            </div>
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</Popover>

<style>
  .spectrum-InputGroup {
    min-width: 0;
    width: 100%;
  }
  .spectrum-Textfield {
    width: 100%;
  }
  .spectrum-Textfield-input {
    width: 0;
  }
  .check {
    display: none;
  }
  li.is-selected .check {
    display: block;
  }

  /* Popover */
  .popover-content {
    display: contents;
  }
  .popover-content:not(.auto-width) .spectrum-Menu-itemLabel {
    width: 0;
    flex: 1 1 auto;
  }
</style>
