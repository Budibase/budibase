<script lang="ts">
  import RowSelector from "./RowSelector.svelte"

  type EditableFields = Record<string, Record<string, unknown>>
  type FieldUpdates = Record<string, Record<string, unknown> | null>

  export let row: Record<string, unknown>
  export let meta: { fields?: EditableFields }
  export let bindings: Record<string, unknown>[] = []

  const compactFields = (fields: FieldUpdates | undefined) => {
    return Object.entries(fields || {}).reduce<EditableFields>(
      (acc, [field, value]) => {
        if (value != null) {
          acc[field] = value
        }
        return acc
      },
      {}
    )
  }

  const onChange = (event: {
    detail: {
      row?: Record<string, unknown>
      meta?: { fields?: FieldUpdates }
    }
  }) => {
    row = event.detail.row || {}
    meta = {
      fields: compactFields(event.detail.meta?.fields),
    }
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
