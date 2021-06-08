<script>
  import { Icon } from "@budibase/bbui"
  import { builderStore } from "../store"

  export let prop
  export let value
  export let icon
  export let rotate = false
  export let bool = false

  $: currentValue = $builderStore.selectedComponent?.[prop]
  $: active = prop && (bool ? !!currentValue : currentValue === value)
</script>

<div
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
    border-radius: 4px;
    color: #666;
    display: flex;
  }
  div:hover {
    background-color: #eee;
    cursor: pointer;
  }
  .active,
  .active:hover {
    background-color: #e5f2ff;
    color: var(--spectrum-global-color-blue-600);
  }
  .rotate {
    transform: rotate(90deg);
  }
</style>
