<script lang="ts">
  import RowSelector from "./RowSelector.svelte"

  export let row: Record<string, any>
  export let meta: { fields?: Record<string, any> }
  export let bindings: any[] = []

  const onChange = (event: CustomEvent) => {
    row = event.detail.row
    meta = event.detail.meta
  }
</script>

<RowSelector
  bind:row
  bind:meta
  {bindings}
  isTestModal={false}
  context={{}}
  componentWidth={320}
  on:change={onChange}
/>
