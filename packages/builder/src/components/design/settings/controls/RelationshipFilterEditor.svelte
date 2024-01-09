<script>
  import { currentAsset, store } from "builderStore"
  import {
    findClosestMatchingComponent,
    findComponent,
  } from "builderStore/componentUtils"
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

  const resolveDatasource = (currentAsset, componentInstance, form) => {
    if (!form && componentInstance._id != $store.selectedComponentId) {
      const block = findComponent(
        currentAsset.props,
        $store.selectedComponentId
      )
      const def = store.actions.components.getDefinition(block._component)
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
