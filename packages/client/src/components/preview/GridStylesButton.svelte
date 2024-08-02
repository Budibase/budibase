<script>
  import { Icon } from "@budibase/bbui"
  import { builderStore } from "stores"

  export let style
  export let value
  export let icon
  export let title
  export let componentId

  // Needs to update in real time

  let currentValue

  $: fetchCurrentValue(componentId, style)
  $: active = currentValue === value

  const fetchCurrentValue = (id, style) => {
    const node = document.getElementsByClassName(`${id}-dom`)[0]?.parentNode
    if (!node) {
      return null
    }
    const styles = getComputedStyle(node)
    currentValue = styles.getPropertyValue(style)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  {title}
  class:active
  on:click={() => {
    builderStore.actions.updateStyles({ [style]: value }, componentId)
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
</style>
