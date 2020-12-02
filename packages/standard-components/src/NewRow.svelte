<script>
  import { getContext } from "svelte"

  const { DataProvider, styleable } = getContext("sdk")
  const component = getContext("component")

  export let table
</script>

<div use:styleable={$component.styles}>
  <DataProvider row={{ tableId: table }}>
    <slot />
  </DataProvider>
</div>
