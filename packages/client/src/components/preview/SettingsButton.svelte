<script>
  import { Icon } from "@budibase/bbui"
  import { builderStore } from "../../store"

  export let prop
  export let value
  export let icon
  export let title
  export let rotate = false
  export let bool = false

  $: currentValue = $builderStore.selectedComponent?.[prop]
  $: active = prop && (bool ? !!currentValue : currentValue === value)
</script>

<div
  {title}
  class:rotate
  class:active
  on:click={() => {
    if (prop) {
      const newValue = bool ? !currentValue : value
      builderStore.actions.updateProp(prop, newValue)
    }
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
  .rotate {
    transform: rotate(90deg);
  }
</style>
