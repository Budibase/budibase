<script>
  import { Icon } from "@budibase/bbui"
  import { builderStore } from "stores"
  import { createEventDispatcher } from "svelte"

  export let prop
  export let value
  export let icon
  export let title
  export let bool = false
  export let active = false
  export let component
  export let disabled = false

  const dispatch = createEventDispatcher()

  $: currentValue = component?.[prop]
  $: active = prop && (bool ? !!currentValue : currentValue === value)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  {title}
  class:active
  class:disabled
  on:click={() => {
    if (prop) {
      const newValue = bool ? !currentValue : value
      builderStore.actions.updateProp(prop, newValue)
    }
    dispatch("click")
  }}
>
  <Icon name={icon} size="S" />
</div>

<style>
  div {
    padding: 6px;
    border-radius: 2px;
    color: var(--spectrum-global-color-gray-700);
    display: flex;
    transition: color 0.13s ease-in-out, background-color 0.13s ease-in-out;
  }
  div:hover {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
  .active,
  .active:hover {
    background-color: rgba(13, 102, 208, 0.1);
    color: var(--spectrum-global-color-blue-600);
  }
  .disabled {
    pointer-events: none;
    color: var(--spectrum-global-color-gray-400);
  }
</style>
