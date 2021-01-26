<script>
  import OptionSelect from "./OptionSelect.svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/storeUtils"

  export let componentInstance
  export let value
  export let onChange
  export let type

  $: form = findClosestMatchingComponent(
    $currentAsset.props,
    componentInstance._id,
    component => component._component === "@budibase/standard-components/form"
  )
  $: datasource = getDatasourceForProvider(form)
  $: schema = getSchemaForDatasource(datasource).schema
  $: options = getOptions(schema, type)

  const getOptions = (schema, fieldType) => {
    let entries = Object.entries(schema)
    if (fieldType) {
      entries = entries.filter(entry => entry[1].type === fieldType)
    }
    return entries.map(entry => entry[0])
  }
</script>

<OptionSelect {value} {onChange} {options} />
