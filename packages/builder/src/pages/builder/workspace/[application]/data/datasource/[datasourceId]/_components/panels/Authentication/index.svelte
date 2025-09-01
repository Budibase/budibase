<script>
  import RestAuthenticationBuilder from "./RestAuthenticationBuilder.svelte"
  import { cloneDeep } from "lodash/fp"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"
  import { integrations } from "@/stores/builder"
  import { notifications } from "@budibase/bbui"

  export let datasource
  $: updatedDatasource = cloneDeep(datasource)

  const updateAuthConfigs = async newAuthConfigs => {
    updatedDatasource.config.authConfigs = newAuthConfigs

    try {
      await integrations.saveDatasource(updatedDatasource)
      notifications.success(
        `Datasource ${updatedDatasource.name} updated successfully`
      )
    } catch (error) {
      notifications.error(`Error saving datasource: ${error.message}`)
    }
  }
</script>

<Panel>
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
