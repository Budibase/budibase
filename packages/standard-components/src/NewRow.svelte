<script>
  import { getContext } from "svelte"

  const { Provider, styleable } = getContext("sdk")
  const component = getContext("component")

  export let table
</script>

<div use:styleable={$component.styles}>
  <Provider data={{ tableId: table }}>
    <slot />
  </Provider>
</div>
