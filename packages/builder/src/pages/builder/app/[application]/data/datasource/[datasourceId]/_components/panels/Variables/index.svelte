<script>
  import { Heading, Layout, notifications } from "@budibase/bbui"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import ViewDynamicVariables from "./ViewDynamicVariables.svelte"
  import { getEnvironmentBindings } from "@/dataBinding"
  import { environment, licensing } from "@/stores/portal"
  import { queries } from "@/stores/builder"
  import { cloneDeep } from "lodash/fp"
  import SaveDatasourceButton from "../SaveDatasourceButton.svelte"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"
  import { onMount } from "svelte"

  export let datasource

  $: updatedDatasource = cloneDeep(datasource)

  $: queriesForDatasource = $queries.list.filter(
    query => query.datasourceId === datasource?._id
  )

  const handleChange = newUnparsedStaticVariables => {
    const newStaticVariables = {}

    newUnparsedStaticVariables.forEach(({ name, value }) => {
      newStaticVariables[name] = value
    })

    updatedDatasource.config.staticVariables = newStaticVariables
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
  <SaveDatasourceButton slot="controls" {datasource} {updatedDatasource} />
  <Tooltip
    slot="tooltip"
    title="REST variables"
    href="https://docs.budibase.com/docs/rest-variables"
  />

  <Layout>
    <Layout noPadding gap="XS">
      <Heading size="S">Static</Heading>
      <KeyValueBuilder
        name="Variable"
        keyPlaceholder="Name"
        headings
        object={updatedDatasource.config.staticVariables}
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
