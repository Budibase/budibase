<script>
  import RestAuthenticationBuilder from "./RestAuthenticationBuilder.svelte"
  import { cloneDeep } from "lodash/fp"
  import SaveDatasourceButton from "../SaveDatasourceButton.svelte"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"

  export let datasource
  $: updatedDatasource = cloneDeep(datasource)

  const updateAuthConfigs = newAuthConfigs => {
    updatedDatasource.config.authConfigs = newAuthConfigs
  }
</script>

<Panel>
  <SaveDatasourceButton slot="controls" {datasource} {updatedDatasource} />
  <Tooltip
    slot="tooltip"
    title="REST Authentication"
    href="https://docs.budibase.com/docs/rest-authentication"
  />
  <RestAuthenticationBuilder
    on:change={({ detail }) => updateAuthConfigs(detail)}
    authConfigs={updatedDatasource.config.authConfigs}
  />
</Panel>
