<script>
  import { DataList } from "@budibase/bbui"
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
  $: datasource = getDatasourceForProvider($currentAsset, form)
  $: schema = getSchemaForDatasource(datasource, true).schema
  $: options = getOptions(schema, type)

  const getOptions = (schema, fieldType) => {
    let entries = Object.entries(schema ?? {})
    if (fieldType) {
      entries = entries.filter(entry => entry[1].type === fieldType)
    }
    return entries.map(entry => entry[0])
  }

  const handleBlur = () => onChange(value)
</script>

<div>
  <DataList
    editable
    secondary
    extraThin
    on:blur={handleBlur}
    on:change
    bind:value>
    <option value="" />
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </DataList>
</div>

<style>
  div {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
  }
  div :global(> div) {
    flex: 1 1 auto;
  }
</style>
