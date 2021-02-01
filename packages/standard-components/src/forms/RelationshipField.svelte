<script>
  import { getContext } from "svelte"
  import SpectrumField from "./SpectrumField.svelte"
  import Picker from "./Picker.svelte"

  const { API } = getContext("sdk")

  export let field
  export let label

  let fieldState
  let fieldApi
  let fieldSchema

  // Picker state
  let options = []
  let tableDefinition

  $: fieldText = `${$fieldState?.value?.length ?? 0} selected rows`
  $: valueLookupMap = getValueLookupMap($fieldState?.value)
  $: isOptionSelected = option => valueLookupMap[option] === true
  $: linkedTableId = fieldSchema?.tableId
  $: fetchRows(linkedTableId)
  $: fetchTable(linkedTableId)

  const fetchTable = async id => {
    if (id != null) {
      tableDefinition = await API.fetchTableDefinition(id)
    }
  }

  const fetchRows = async id => {
    if (id != null) {
      options = await API.fetchTableData(id)
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
    if ($fieldState.value.includes(option)) {
      fieldApi.setValue($fieldState.value.filter(x => x !== option))
    } else {
      fieldApi.setValue([...$fieldState.value, option])
    }
  }
</script>

<SpectrumField
  {label}
  {field}
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
</SpectrumField>
