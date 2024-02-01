<script>
  import {
    findClosestMatchingComponent,
    findComponent,
  } from "stores/builder/components/utils"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "../../../../dataBinding"
  import { tables, currentAsset, componentStore } from "stores/builder"
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

  const resolveDatasource = (currentAsset, componentInstance, form) => {
    if (!form && componentInstance._id != $componentStore.selectedComponentId) {
      const block = findComponent(
        currentAsset.props,
        $componentStore.selectedComponentId
      )
      const def = componentStore.getDefinition(block._component)
      return def?.block === true
        ? getDatasourceForProvider(currentAsset, block)
        : {}
    } else {
      return getDatasourceForProvider(currentAsset, form)
    }
  }

  // Get that form's schema
  $: datasource = resolveDatasource($currentAsset, componentInstance, form)
  $: formSchema = getSchemaForDatasource($currentAsset, datasource)?.schema

  // Get the schema for the relationship field that this picker is using
  $: columnSchema = formSchema?.[column]

  // Get the schema for the table on the other side of this relationship
  $: linkedTable = $tables.list.find(x => x._id === columnSchema?.tableId)
  $: schema = linkedTable?.schema
</script>

<FilterEditor on:change {...$$props} {schema} on:drawerHide on:drawerShow />
