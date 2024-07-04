<script>
import { Heading, Layout } from "@budibase/bbui"
import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
import { getEnvironmentBindings } from "dataBinding"
import { cloneDeep } from "lodash/fp"
import { queries } from "stores/builder"
import { licensing } from "stores/portal"
import Panel from "../Panel.svelte"
import SaveDatasourceButton from "../SaveDatasourceButton.svelte"
import Tooltip from "../Tooltip.svelte"
import ViewDynamicVariables from "./ViewDynamicVariables.svelte"

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
