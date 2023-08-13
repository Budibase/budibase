<script>
  import { currentAsset } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/componentUtils"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { tables } from "stores/backend"
  import FilterEditor from "./FilterEditor/FilterEditor.svelte"

  export let componentInstance

  // Extract which relationship column we're using
  $: column = componentInstance.field

  // Find the closest parent form
  $: form = findClosestMatchingComponent(
    $currentAsset.props,
    componentInstance._id,
    component => component._component.endsWith("/form")
  )

  // Get that form's schema
  $: datasource = getDatasourceForProvider($currentAsset, form)
  $: formSchema = getSchemaForDatasource($currentAsset, datasource)?.schema

  // Get the schema for the relationship field that this picker is using
  $: columnSchema = formSchema?.[column]

  // Get the schema for the table on the other side of this relationship
  $: linkedTable = $tables.list.find(x => x._id === columnSchema?.tableId)
  $: schema = linkedTable?.schema
</script>

<FilterEditor on:change {...$$props} {schema} />
