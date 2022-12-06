<script>
  import { Combobox } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/componentUtils"

  export let componentInstance
  export let value
  export let type

  $: form = findClosestMatchingComponent(
    $currentAsset?.props,
    componentInstance._id,
    component => component._component === "@budibase/standard-components/form"
  )
  $: datasource = getDatasourceForProvider($currentAsset, form)
  $: schema = getSchemaForDatasource($currentAsset, datasource, {
    formSchema: true,
  }).schema
  $: options = getOptions(schema, type)

  const getOptions = (schema, type) => {
    let entries = Object.entries(schema ?? {})
    let types = []
    if (type === "field/options" || type === "field/barcode/qr") {
      // allow options to be used on both options and string fields
      types = [type, "field/string"]
    } else {
      types = [type]
    }

    types = types.map(type => type.slice(type.indexOf("/") + 1))

    entries = entries.filter(entry => types.includes(entry[1].type))
    return entries.map(entry => entry[0])
  }
</script>

<Combobox on:change {value} {options} />
