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
  export let fieldTypes

  $: form = findClosestMatchingComponent(
    $currentAsset.props,
    componentInstance._id,
    component => component._component === "@budibase/standard-components/form"
  )
  $: datasource = getDatasourceForProvider($currentAsset, form)
  $: schema = getSchemaForDatasource($currentAsset, datasource, true).schema
  $: options = getOptions(schema, type, fieldTypes)

  const getOptions = (schema, type, fieldTypes) => {
    let entries = Object.entries(schema ?? {})

    // fallback to using only field/options fields
    if (!fieldTypes) {
      fieldTypes = [type]
    }

    const types = fieldTypes.map(fieldType => fieldType.split("/")[1])
    entries = entries.filter(entry => types.includes(entry[1].type))

    return entries.map(entry => entry[0])
  }
</script>

<Combobox on:change {value} {options} />
