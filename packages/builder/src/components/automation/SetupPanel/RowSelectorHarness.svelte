<script lang="ts">
  import RowSelector from "./RowSelector.svelte"

  type EditableFields = Record<string, Record<string, unknown>>

  export let row: Record<string, unknown>
  export let meta: { fields?: EditableFields }
  export let bindings: Record<string, unknown>[] = []

  const onChange = (event: {
    detail: {
      row?: Record<string, unknown>
      meta?: { fields?: EditableFields }
    }
  }) => {
    row = event.detail.row || {}
    meta = event.detail.meta || {}
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
