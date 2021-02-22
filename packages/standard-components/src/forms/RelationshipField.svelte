<script>
  import { getContext } from "svelte"
  import Field from "./Field.svelte"
  import Picker from "./Picker.svelte"

  const { API } = getContext("sdk")

  export let field
  export let label
  export let placeholder
  export let disabled = false

  let fieldState
  let fieldApi
  let fieldSchema

  // Picker state
  let options = []
  let tableDefinition
  let fieldText = ""

  const setFieldText = value => {
    if (fieldSchema?.relationshipType === "one-to-many") {
      if (value?.length && options?.length) {
        const row = options.find(row => row._id === value[0])
        return row.name
      } else {
        return placeholder || "Choose an option"
      }
    } else {
      if (value?.length) {
        return `${value?.length ?? 0} selected rows`
      } else {
        return placeholder || "Choose some options"
      }
    }
  }

  $: options, (fieldText = setFieldText($fieldState?.value))
  $: valueLookupMap = getValueLookupMap($fieldState?.value)
  $: isOptionSelected = option => valueLookupMap[option] === true
  $: linkedTableId = fieldSchema?.tableId
  $: fetchRows(linkedTableId)
  $: fetchTable(linkedTableId)

  const fetchTable = async id => {
    if (id) {
      const result = await API.fetchTableDefinition(id)
      if (!result.error) {
        tableDefinition = result
      }
    }
  }

  const fetchRows = async id => {
    if (id) {
      const rows = await API.fetchTableData(id)
      options = rows && !rows.error ? rows : []
    }
  }

  const getDisplayName = row => {
    return row[tableDefinition?.primaryDisplay || "_id"]
  }

  const getValueLookupMap = value => {
    let map = {}
    if (value?.length) {
      value.forEach(option => {
        map[option] = true
      })
    }
    return map
  }

  const toggleOption = option => {
    if (fieldSchema.type === "one-to-many") {
      fieldApi.setValue([option])
    } else {
      if ($fieldState.value.includes(option)) {
        fieldApi.setValue($fieldState.value.filter(x => x !== option))
      } else {
        fieldApi.setValue([...$fieldState.value, option])
      }
    }
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
  defaultValue={[]}>
  <Picker
    {fieldState}
    {fieldText}
    {options}
    {isOptionSelected}
    onSelectOption={toggleOption}
    getOptionLabel={getDisplayName}
    getOptionValue={option => option._id} />
</Field>
