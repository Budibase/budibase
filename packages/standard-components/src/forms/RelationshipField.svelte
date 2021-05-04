<script>
  import { CoreSelect, CoreMultiselect } from "@budibase/bbui"
  import { getContext } from "svelte"
  import Field from "./Field.svelte"

  const { API } = getContext("sdk")

  export let field
  export let label
  export let placeholder
  export let disabled = false

  let fieldState
  let fieldApi
  let fieldSchema

  let options = []
  let tableDefinition

  $: multiselect = fieldSchema?.relationshipType !== "one-to-many"
  $: linkedTableId = fieldSchema?.tableId
  $: fetchRows(linkedTableId)
  $: fetchTable(linkedTableId)
  $: singleValue = flatten($fieldState?.value)?.[0]
  $: multiValue = flatten($fieldState?.value) ?? []

  const fetchTable = async (id) => {
    if (id) {
      const result = await API.fetchTableDefinition(id)
      if (!result.error) {
        tableDefinition = result
      }
    }
  }

  const fetchRows = async (id) => {
    if (id) {
      const rows = await API.fetchTableData(id)
      options = rows && !rows.error ? rows : []
    }
  }

  const flatten = (values) => {
    if (!values) {
      return []
    }
    return values.map((value) =>
      typeof value === "object" ? value._id : value
    )
  }

  const getDisplayName = (row) => {
    return row?.[tableDefinition?.primaryDisplay || "_id"] || "-"
  }

  const singleHandler = (e) => {
    fieldApi.setValue(e.detail == null ? [] : [e.detail])
  }

  const multiHandler = (e) => {
    fieldApi.setValue(e.detail)
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  type="link"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
  defaultValue={[]}
>
  {#if fieldState}
    <svelte:component
      this={multiselect ? CoreMultiselect : CoreSelect}
      {options}
      value={multiselect ? multiValue : singleValue}
      on:change={multiselect ? multiHandler : singleHandler}
      id={$fieldState.fieldId}
      disabled={$fieldState.disabled}
      error={$fieldState.error}
      getOptionLabel={getDisplayName}
      getOptionValue={(option) => option._id}
    />
  {/if}
</Field>
