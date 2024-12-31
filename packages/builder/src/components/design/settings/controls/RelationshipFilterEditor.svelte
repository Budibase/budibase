<script>
  import {
    findClosestMatchingComponent,
    findComponent,
  } from "@/helpers/components"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "@/dataBinding"
  import { tables, selectedScreen, componentStore } from "@/stores/builder"
  import FilterEditor from "./FilterEditor/FilterEditor.svelte"

  export let componentInstance

  // Extract which relationship column we're using
  $: column = componentInstance.field

  // Find the closest parent form
  $: form = findClosestMatchingComponent(
    $selectedScreen.props,
    componentInstance._id,
    component => component._component.endsWith("/form")
  )

  const resolveDatasource = (selectedScreen, componentInstance, form) => {
    if (!form && componentInstance._id != $componentStore.selectedComponentId) {
      const block = findComponent(
        selectedScreen.props,
        $componentStore.selectedComponentId
      )
      const def = componentStore.getDefinition(block._component)
      return def?.block === true
        ? getDatasourceForProvider(selectedScreen, block)
        : {}
    } else {
      return getDatasourceForProvider(selectedScreen, form)
    }
  }

  // Get that form's schema
  $: datasource = resolveDatasource($selectedScreen, componentInstance, form)
  $: formSchema = getSchemaForDatasource($selectedScreen, datasource)?.schema

  // Get the schema for the relationship field that this picker is using
  $: columnSchema = formSchema?.[column]

  // Get the schema for the table on the other side of this relationship
  $: linkedTable = $tables.list.find(x => x._id === columnSchema?.tableId)
  $: schema = linkedTable?.schema
</script>

<FilterEditor on:change {...$$props} {schema} on:drawerHide on:drawerShow />
