<script lang="ts">
  import "@spectrum-css/checkbox/dist/index-vars.css"
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import type { ChangeEventHandler } from "svelte/elements"
  import { Icon } from "@budibase/bbui"

  export let value = false
  export let id: string | undefined = undefined
  export let text: string | undefined = undefined
  export let disabled = false
  export let readonly = false
  export let size: "S" | "M" | "L" | "XL" = "M"
  export let indeterminate = false

  const dispatch = createEventDispatcher()
  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    dispatch("change", event.currentTarget.checked)
  }

  $: sizeClass = `spectrum-Checkbox--size${size}`
</script>

<label
  class="spectrum-Checkbox spectrum-Checkbox--emphasized {sizeClass}"
  class:checked={value}
  class:is-indeterminate={indeterminate}
  class:readonly
>
  <input
    checked={value}
    {disabled}
    on:change={onChange}
    type="checkbox"
    class="spectrum-Checkbox-input"
    {id}
  />
  <span class="spectrum-Checkbox-box">
    <span class="icon check">
      <Icon
        name="check"
        weight="bold"
        color="var(--spectrum-global-color-gray-50)"
      />
    </span>
    <span class="icon indeterminate">
      <Icon
        name="minus"
        weight="bold"
        color="var(--spectrum-global-color-gray-50)"
      />
    </span>
  </span>
  {#if text}
    <span class="spectrum-Checkbox-label">{text}</span>
  {/if}
</label>

<style>
  .icon {
    display: none;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  .checked .check.icon,
  .is-indeterminate .indeterminate.icon {
    display: block;
  }
  .spectrum-Checkbox--sizeS :global(i) {
    font-size: 12px;
  }
  .spectrum-Checkbox--sizeM :global(i) {
    font-size: 14px;
  }
  .spectrum-Checkbox--sizeL :global(i) {
    font-size: 16px;
  }
  .spectrum-Checkbox--sizeXL :global(i) {
    font-size: 18px;
  }
  .spectrum-Checkbox-input {
    opacity: 0;
  }
  .readonly {
    pointer-events: none;
  }
</style>
