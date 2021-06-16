<script>
  import { Combobox } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/storeUtils"

  export let componentInstance
  export let value
  export let type

  $: form = findClosestMatchingComponent(
    $currentAsset.props,
    componentInstance._id,
    component => component._component === "@budibase/standard-components/form"
  )
  $: datasource = getDatasourceForProvider($currentAsset, form)
  $: schema = getSchemaForDatasource($currentAsset, datasource, true).schema
  $: options = getOptions(schema, type)

  const getOptions = (schema, fieldType) => {
    let entries = Object.entries(schema ?? {})
    if (fieldType) {
      entries = entries.filter(entry => entry[1].type === fieldType)
    }
    return entries.map(entry => entry[0])
  }
</script>

<Combobox on:change {value} {options} />
