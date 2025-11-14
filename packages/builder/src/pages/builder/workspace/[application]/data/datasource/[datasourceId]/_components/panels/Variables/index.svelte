<script>
  import { Heading, Layout, notifications } from "@budibase/bbui"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import ViewDynamicVariables from "./ViewDynamicVariables.svelte"
  import { getEnvironmentBindings } from "@/dataBinding"
  import { environment, licensing } from "@/stores/portal"
  import { queries } from "@/stores/builder"
  import { cloneDeep, isEqual } from "lodash/fp"
  import Panel from "../Panel.svelte"
  import { onMount } from "svelte"

  export let datasource
  export let updatedDatasource
  export let markDirty

  // Use parent-provided updatedDatasource when available
  let localUpdatedDatasource
  $: localUpdatedDatasource = updatedDatasource ?? cloneDeep(datasource)

  $: queriesForDatasource = $queries.list.filter(
    query => query.datasourceId === datasource?._id
  )

  const handleChange = newUnparsedStaticVariables => {
    const newStaticVariables = {}

    newUnparsedStaticVariables.forEach(({ name, value }) => {
      const key = (name ?? "").toString().trim()
      const valStr = value == null ? "" : value.toString ? value.toString() : ""
      const val = valStr.trim()
      if (key !== "" || val !== "") {
        newStaticVariables[key] = value
      }
    })

    const prev = localUpdatedDatasource.config.staticVariables || {}
    if (!isEqual(prev, newStaticVariables)) {
      localUpdatedDatasource.config.staticVariables = newStaticVariables
      markDirty && markDirty()
    }
  }

  onMount(async () => {
    try {
      await environment.loadVariables()
    } catch (error) {
      notifications.error(`Error getting environment variables - ${error}`)
    }
  })
</script>

<Panel>
  <Layout>
    <Layout noPadding gap="XS">
      <Heading size="S">Static</Heading>
      <KeyValueBuilder
        name="Variable"
        keyPlaceholder="Name"
        headings
        object={localUpdatedDatasource.config.staticVariables}
        on:change={({ detail }) => handleChange(detail)}
        bindings={$licensing.environmentVariablesEnabled
          ? getEnvironmentBindings()
          : []}
      />
    </Layout>
    <Layout noPadding gap="XS">
      <Heading size="S">Dynamic</Heading>
      <ViewDynamicVariables queries={queriesForDatasource} {datasource} />
    </Layout>
  </Layout>
</Panel>
