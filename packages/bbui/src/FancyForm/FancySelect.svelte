<script>
  import { createEventDispatcher } from "svelte"
  import FancyField from "./FancyField.svelte"
  import Icon from "../Icon/Icon.svelte"
  import Popover from "../Popover/Popover.svelte"

  export let label
  export let value
  export let disabled = false
  export let error = null
  export let validate = null
  export let options = []
  export let getOptionLabel = option => extractProperty(option, "label")
  export let getOptionValue = option => extractProperty(option, "value")

  const dispatch = createEventDispatcher()

  let open = false
  let popover
  let wrapper

  $: placeholder = !value

  const extractProperty = (value, property) => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
  }

  const onChange = newValue => {
    dispatch("change", newValue)
    value = newValue
    if (validate) {
      error = validate(newValue)
    }
    open = false
  }
</script>

<div bind:this={wrapper}>
  <FancyField
    {error}
    {value}
    {validate}
    {disabled}
    clickable
    on:click={() => (open = true)}
  >
    {#if label}
      <div class="label" class:placeholder>
        {label}
      </div>
    {/if}

    <div class="value" class:placeholder>
      {value || ""}
    </div>

    <div class="arrow">
      <Icon name="ChevronDown" />
    </div>
  </FancyField>
</div>

<svelte:head>
  <script>
    console.log("FOO")
  </script>
</svelte:head>

<span>
  <Popover
    anchor={wrapper}
    align="left"
    portalTarget={document.documentElement}
    bind:this={popover}
    {open}
    on:close={() => (open = false)}
    useAnchorWidth={true}
    maxWidth={null}
  >
    <div class="popover-content">
      {#if options.length}
        {#each options as option, idx}
          <div
            class="popover-option"
            tabindex="0"
            on:click={() => onChange(getOptionValue(option, idx))}
          >
            <span class="option-text">
              {getOptionLabel(option, idx)}
            </span>
            {#if value === getOptionValue(option, idx)}
              <Icon name="Checkmark" />
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </Popover>
</span>

<style>
  span :global(.spectrum-Popover) {
    background: red !important;
  }

  .label {
    font-size: 14px;
    font-weight: 500;
    transform: translateY(-50%);
    position: absolute;
    top: 18px;
    color: var(--spectrum-global-color-gray-600);
    transition: font-size 130ms ease-out, top 130ms ease-out;
  }
  .label.placeholder {
    top: 50%;
    font-size: 15px;
    transform: translateY(-50%);
  }
  .value {
    display: block;
    flex: 1 1 auto;
    font-size: 15px;
    margin-top: 18px;
    color: var(--spectrum-global-color-gray-900);
    transition: margin-top 130ms ease-out, opacity 130ms ease-out;
    opacity: 1;
  }
  .value.placeholder {
    opacity: 0;
    pointer-events: none;
    margin-top: 0;
  }
  .popover-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 10px 0;
  }
  .popover-option {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 7px 12px;
    transition: background 130ms ease-out;
  }
  .popover-option:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
</style>
